import { AppProvider, useApp } from "../contexts/AppContext";
import { renderHook, act } from "@testing-library/react";
import React from "react";

describe("AppContext", () => {
  it("should provide default state and allow dispatch", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );
    const { result } = renderHook(() => useApp(), { wrapper });
    expect(result.current.state).toBeDefined();
    // Create a valid Theme object
    const darkTheme: import("../types").Theme = {
      mode: "dark",
      colors: {
        primary: "#000000",
        secondary: "#222222",
        accent: "#333333",
        background: "#111111",
        surface: "#222222",
        text: "#ffffff",
      },
    };
    act(() => {
      result.current.dispatch({ type: "SET_THEME", payload: darkTheme });
    });
    expect(result.current.state.theme.mode).toBe("dark");
  });
});
