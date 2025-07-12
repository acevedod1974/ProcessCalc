import {
  useLocalStorage,
  useCalculationHistory,
} from "../hooks/useLocalStorage";
import { renderHook, act } from "@testing-library/react-hooks";

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
  it("should initialize and update calculation history", () => {
    const { result } = renderHook(() => useCalculationHistory());
    expect(Array.isArray(result.current[0])).toBe(true);
    act(() => {
      result.current[1]([{ id: 1, name: "Test" }]);
    });
    expect(result.current[0][0].name).toBe("Test");
  });
});
