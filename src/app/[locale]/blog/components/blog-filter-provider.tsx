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
  query: string;
  page: number;
  isFiltering: boolean;
  toggleTag: (tag: string) => void;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
  clearAll: () => void;
}

const BlogFilterContext = createContext<BlogFilterValue | null>(null);

export function useBlogFilter() {
  const value = useContext(BlogFilterContext);

  if (!value) {
    throw new Error("useBlogFilter must be used inside a BlogFilterProvider");
  }

  return value;
}

function readStateFromUrl(availableTags: readonly string[]) {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page") ?? "", 10);

  return {
    tags: (params.get("tags") ?? "")
      .split(",")
      .filter((tag) => availableTags.includes(tag)),
    query: params.get("q") ?? "",
    page: Number.isNaN(page) || page < 1 ? 1 : page,
  };
}

function buildSearch(
  selectedTags: string[],
  query: string,
  page: number
): string {
  const params = new URLSearchParams(window.location.search);

  if (selectedTags.length > 0) {
    params.set("tags", selectedTags.join(","));
  } else {
    params.delete("tags");
  }

  if (query.trim()) {
    params.set("q", query.trim());
  } else {
    params.delete("q");
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const search = params.toString();

  return search ? `?${search}` : "";
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
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const availableTagsRef = useRef(availableTags);

  useEffect(() => {
    const syncFromUrl = () => {
      const state = readStateFromUrl(availableTagsRef.current);

      setSelectedTags(state.tags);
      setQueryState(state.query);
      setPage(state.page);
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

    const search = buildSearch(selectedTags, query, page);

    if (search === window.location.search) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search}`
    );
  }, [selectedTags, query, page, isHydrated]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag)
        ? previous.filter((selected) => selected !== tag)
        : [...previous, tag]
    );
    setPage(1);
  }, []);

  const setQuery = useCallback((next: string) => {
    setQueryState(next);
    setPage(1);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedTags([]);
    setQueryState("");
    setPage(1);
  }, []);

  const value = useMemo(
    () => ({
      selectedTags,
      query,
      page,
      isFiltering: selectedTags.length > 0 || query.trim() !== "",
      toggleTag,
      setQuery,
      setPage,
      clearAll,
    }),
    [selectedTags, query, page, toggleTag, setQuery, clearAll]
  );

  return (
    <BlogFilterContext.Provider value={value}>
      {children}
    </BlogFilterContext.Provider>
  );
}
