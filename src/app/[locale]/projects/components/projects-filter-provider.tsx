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

export type SortOrder = "none" | "asc" | "desc";

const SORT_ORDERS = ["none", "asc", "desc"] as const;

interface ProjectsFilterValue {
  selectedTags: string[];
  sortOrder: SortOrder;
  toggleTag: (tag: string) => void;
  changeSortOrder: (sortOrder: SortOrder) => void;
}

interface ProjectsFilterState {
  selectedTags: string[];
  sortOrder: SortOrder;
  isHydrated: boolean;
}

const ProjectsFilterContext = createContext<ProjectsFilterValue | null>(null);

export function useProjectsFilter() {
  const value = useContext(ProjectsFilterContext);

  if (!value) {
    throw new Error(
      "useProjectsFilter must be used inside a ProjectsFilterProvider"
    );
  }

  return value;
}

function isSortOrder(value: string | null): value is SortOrder {
  return value !== null && SORT_ORDERS.includes(value as SortOrder);
}

function readSearchParams(
  availableTags: readonly string[]
): Omit<ProjectsFilterState, "isHydrated"> {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");

  return {
    selectedTags: (params.get("tags") ?? "")
      .split(",")
      .filter((tag) => availableTags.includes(tag)),
    sortOrder: isSortOrder(sort) ? sort : "none",
  };
}

function buildSearch(selectedTags: string[], sortOrder: SortOrder): string {
  const params = new URLSearchParams(window.location.search);

  if (selectedTags.length > 0) {
    params.set("tags", selectedTags.join(","));
  } else {
    params.delete("tags");
  }

  if (sortOrder !== "none") {
    params.set("sort", sortOrder);
  } else {
    params.delete("sort");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

interface ProjectsFilterProviderProps {
  availableTags: readonly string[];
  children: React.ReactNode;
}

export function ProjectsFilterProvider({
  availableTags,
  children,
}: ProjectsFilterProviderProps) {
  const [state, setState] = useState<ProjectsFilterState>({
    selectedTags: [],
    sortOrder: "none",
    isHydrated: false,
  });

  const availableTagsRef = useRef(availableTags);

  useEffect(() => {
    const syncFromUrl = () => {
      setState({
        ...readSearchParams(availableTagsRef.current),
        isHydrated: true,
      });
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    if (!state.isHydrated) {
      return;
    }

    const search = buildSearch(state.selectedTags, state.sortOrder);

    if (search === window.location.search) {
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search}`
    );
  }, [state]);

  const toggleTag = useCallback((tag: string) => {
    setState((previous) => ({
      ...previous,
      selectedTags: previous.selectedTags.includes(tag)
        ? previous.selectedTags.filter((selected) => selected !== tag)
        : [...previous.selectedTags, tag],
    }));
  }, []);

  const changeSortOrder = useCallback((sortOrder: SortOrder) => {
    setState((previous) => ({ ...previous, sortOrder }));
  }, []);

  const value = useMemo(
    () => ({
      selectedTags: state.selectedTags,
      sortOrder: state.sortOrder,
      toggleTag,
      changeSortOrder,
    }),
    [state.selectedTags, state.sortOrder, toggleTag, changeSortOrder]
  );

  return (
    <ProjectsFilterContext.Provider value={value}>
      {children}
    </ProjectsFilterContext.Provider>
  );
}
