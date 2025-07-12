import { AppProvider, useApp } from "../contexts/AppContext";
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";

describe("AppContext", () => {
  it("should provide default state and allow dispatch", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.state).toBeDefined();
    act(() => {
      result.current.dispatch({ type: "SET_THEME", payload: "dark" });
    });
    expect(result.current.state.theme).toBe("dark");
  });
});
