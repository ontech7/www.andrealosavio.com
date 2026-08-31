"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface BlogFilterValue {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
}

const BlogFilterContext = createContext<BlogFilterValue | null>(null);

export function useBlogFilter() {
  const value = useContext(BlogFilterContext);

  if (!value) {
    throw new Error("useBlogFilter must be used inside a BlogFilterProvider");
  }

  return value;
}

function readTagsFromUrl(availableTags: readonly string[]): string[] {
  const params = new URLSearchParams(window.location.search);

  return (params.get("tags") ?? "")
    .split(",")
    .filter((tag) => availableTags.includes(tag));
}

function buildSearch(selectedTags: string[]): string {
  const params = new URLSearchParams(window.location.search);

  if (selectedTags.length > 0) {
    params.set("tags", selectedTags.join(","));
  } else {
    params.delete("tags");
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

interface BlogFilterProviderProps {
  availableTags: readonly string[];
  children: React.ReactNode;
}

export function BlogFilterProvider({
  availableTags,
  children,
}: BlogFilterProviderProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const availableTagsRef = useRef(availableTags);

  useEffect(() => {
    const syncFromUrl = () => {
      setSelectedTags(readTagsFromUrl(availableTagsRef.current));
      setIsHydrated(true);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);

    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const search = buildSearch(selectedTags);

    if (search === window.location.search) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search}`
    );
  }, [selectedTags, isHydrated]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag)
        ? previous.filter((selected) => selected !== tag)
        : [...previous, tag]
    );
  }, []);

  const clearTags = useCallback(() => setSelectedTags([]), []);

  const value = useMemo(
    () => ({ selectedTags, toggleTag, clearTags }),
    [selectedTags, toggleTag, clearTags]
  );

  return (
    <BlogFilterContext.Provider value={value}>
      {children}
    </BlogFilterContext.Provider>
  );
}
