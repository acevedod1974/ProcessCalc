import { useState } from "react";

export interface CalculationHistoryItem {
  id: string;
  timestamp: string;
  [key: string]: unknown;
}

export interface ProjectItem {
  id: string;
  createdAt: string;
  lastModified: string;
  [key: string]: unknown;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export interface CalculationHistory {
  calculations: CalculationHistoryItem[];
  projects: ProjectItem[];
  addCalculation: (
    calculation: Omit<CalculationHistoryItem, "id" | "timestamp">
  ) => CalculationHistoryItem;
  updateCalculation: (
    id: string,
    updates: Partial<CalculationHistoryItem>
  ) => void;
  deleteCalculation: (id: string) => void;
  addProject: (
    project: Omit<ProjectItem, "id" | "createdAt" | "lastModified">
  ) => ProjectItem;
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
}

export function useCalculationHistory(): CalculationHistory {
  const [calculations, setCalculations] = useLocalStorage<
    CalculationHistoryItem[]
  >("processcalc-calculations", []);
  const [projects, setProjects] = useLocalStorage<ProjectItem[]>(
    "processcalc-projects",
    []
  );

  const addCalculation = (
    calculation: Omit<CalculationHistoryItem, "id" | "timestamp">
  ): CalculationHistoryItem => {
    const newCalculation: CalculationHistoryItem = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setCalculations((prev) => [newCalculation, ...prev]);
    return newCalculation;
  };

  const updateCalculation = (
    id: string,
    updates: Partial<CalculationHistoryItem>
  ): void => {
    setCalculations((prev) =>
      prev.map((calc) => (calc.id === id ? { ...calc, ...updates } : calc))
    );
  };

  const deleteCalculation = (id: string): void => {
    setCalculations((prev) => prev.filter((calc) => calc.id !== id));
  };

  const addProject = (
    project: Omit<ProjectItem, "id" | "createdAt" | "lastModified">
  ): ProjectItem => {
    const newProject: ProjectItem = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<ProjectItem>): void => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updates, lastModified: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string): void => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    setCalculations((prev) => prev.filter((calc) => calc.projectId !== id));
  };

  return {
    calculations,
    projects,
    addCalculation,
    updateCalculation,
    deleteCalculation,
    addProject,
    updateProject,
    deleteProject,
  };
}
