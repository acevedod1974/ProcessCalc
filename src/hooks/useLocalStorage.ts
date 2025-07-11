import { useState } from 'react';
import { Calculation, Project } from '../types';

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
  const [calculations, setCalculations] = useLocalStorage<Calculation[]>('processcalc-calculations', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('processcalc-projects', []);

  const addCalculation = (calculation: Omit<Calculation, 'id' | 'timestamp'>) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setCalculations((prev: Calculation[]) => [newCalculation, ...prev]);
    return newCalculation;
  };

  const updateCalculation = (id: string, updates: Partial<Calculation>) => {
    setCalculations((prev: Calculation[]) => 
      prev.map(calc => calc.id === id ? { ...calc, ...updates } : calc)
    );
  };

  const deleteCalculation = (id: string) => {
    setCalculations((prev: Calculation[]) => prev.filter(calc => calc.id !== id));
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setProjects((prev: Project[]) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev: Project[]) => 
      prev.map(project => 
        project.id === id 
          ? { ...project, ...updates, lastModified: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev: Project[]) => prev.filter(project => project.id !== id));
    // Also remove calculations associated with this project
    setCalculations((prev: Calculation[]) => prev.filter(calc => 'projectId' in calc && calc.projectId !== id));
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