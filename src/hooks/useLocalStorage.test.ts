import {
  useLocalStorage,
  useCalculationHistory,
} from "../hooks/useLocalStorage";
import { renderHook, act } from "@testing-library/react";

describe("useLocalStorage", () => {
  it("should initialize with default value and update localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
    act(() => {
      result.current[1]("new-value");
    });
    expect(result.current[0]).toBe("new-value");
    expect(localStorage.getItem("test-key")).toContain("new-value");
  });
});

describe("useCalculationHistory", () => {
  it("should initialize with empty calculations and add a calculation", () => {
    const { result } = renderHook(() => useCalculationHistory());
    expect(Array.isArray(result.current.calculations)).toBe(true);
    expect(result.current.calculations.length).toBe(0);
    act(() => {
      result.current.addCalculation({
        type: "volumetric",
        process: "rolling",
        name: "Test Calculation",
        parameters: {
          initialThickness: 10,
          finalThickness: 5,
          width: 100,
          speed: 1,
          materialId: "mat1",
          frictionCoefficient: 0.2,
        },
        results: {
          force: 1000,
          torque: 500,
          power: 10,
          reduction: 0.5,
          stress: 200,
          strain: 0.1,
          efficiency: 0.9,
        },
        userId: "user1",
        // notes is optional
      });
    });
    expect(result.current.calculations.length).toBe(1);
    expect(result.current.calculations[0].name).toBe("Test Calculation");
  });
});
