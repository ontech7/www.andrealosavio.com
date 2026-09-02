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
  selectedRoles: string[];
  sortOrder: SortOrder;
  toggleTag: (tag: string) => void;
  toggleRole: (role: string) => void;
  changeSortOrder: (sortOrder: SortOrder) => void;
}

interface ProjectsFilterState {
  selectedTags: string[];
  selectedRoles: string[];
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
  availableTags: readonly string[],
  availableRoles: readonly string[]
): Omit<ProjectsFilterState, "isHydrated"> {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");

  return {
    selectedTags: (params.get("tags") ?? "")
      .split(",")
      .filter((tag) => availableTags.includes(tag)),
    selectedRoles: (params.get("roles") ?? "")
      .split(",")
      .filter((role) => availableRoles.includes(role)),
    sortOrder: isSortOrder(sort) ? sort : "none",
  };
}

function buildSearch(
  selectedTags: string[],
  selectedRoles: string[],
  sortOrder: SortOrder
): string {
  const params = new URLSearchParams(window.location.search);

  const setOrDelete = (key: string, values: string[]) => {
    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }
  };

  setOrDelete("tags", selectedTags);
  setOrDelete("roles", selectedRoles);

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
  availableRoles: readonly string[];
  children: React.ReactNode;
}

export function ProjectsFilterProvider({
  availableTags,
  availableRoles,
  children,
}: ProjectsFilterProviderProps) {
  const [state, setState] = useState<ProjectsFilterState>({
    selectedTags: [],
    selectedRoles: [],
    sortOrder: "none",
    isHydrated: false,
  });

  const availableTagsRef = useRef(availableTags);
  const availableRolesRef = useRef(availableRoles);

  useEffect(() => {
    const syncFromUrl = () => {
      setState({
        ...readSearchParams(
          availableTagsRef.current,
          availableRolesRef.current
        ),
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

    const search = buildSearch(
      state.selectedTags,
      state.selectedRoles,
      state.sortOrder
    );

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

  const toggleRole = useCallback((role: string) => {
    setState((previous) => ({
      ...previous,
      selectedRoles: previous.selectedRoles.includes(role)
        ? previous.selectedRoles.filter((selected) => selected !== role)
        : [...previous.selectedRoles, role],
    }));
  }, []);

  const changeSortOrder = useCallback((sortOrder: SortOrder) => {
    setState((previous) => ({ ...previous, sortOrder }));
  }, []);

  const value = useMemo(
    () => ({
      selectedTags: state.selectedTags,
      selectedRoles: state.selectedRoles,
      sortOrder: state.sortOrder,
      toggleTag,
      toggleRole,
      changeSortOrder,
    }),
    [
      state.selectedTags,
      state.selectedRoles,
      state.sortOrder,
      toggleTag,
      toggleRole,
      changeSortOrder,
    ]
  );

  return (
    <ProjectsFilterContext.Provider value={value}>
      {children}
    </ProjectsFilterContext.Provider>
  );
}
