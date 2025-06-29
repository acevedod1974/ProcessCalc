import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
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
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useCalculationHistory() {
  const [calculations, setCalculations] = useLocalStorage('processcalc-calculations', []);
  const [projects, setProjects] = useLocalStorage('processcalc-projects', []);

  const addCalculation = (calculation: any) => {
    const newCalculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setCalculations((prev: any[]) => [newCalculation, ...prev]);
    return newCalculation;
  };

  const updateCalculation = (id: string, updates: any) => {
    setCalculations((prev: any[]) => 
      prev.map(calc => calc.id === id ? { ...calc, ...updates } : calc)
    );
  };

  const deleteCalculation = (id: string) => {
    setCalculations((prev: any[]) => prev.filter(calc => calc.id !== id));
  };

  const addProject = (project: any) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setProjects((prev: any[]) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: any) => {
    setProjects((prev: any[]) => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, lastModified: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev: any[]) => prev.filter(project => project.id !== id));
    // Also remove calculations associated with this project
    setCalculations((prev: any[]) => prev.filter(calc => calc.projectId !== id));
  };

  return {
    calculations,
    projects,
    addCalculation,
    updateCalculation,
    deleteCalculation,
    addProject,
    updateProject,
    deleteProject
  };
}