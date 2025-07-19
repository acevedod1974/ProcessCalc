// src/utils/api.ts

import type { Calculation } from "../types";

export async function saveCalculation(data: Calculation) {
  const res = await fetch("http://localhost:4000/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save calculation");
  return res.json();
}

export async function getAllCalculations() {
  const res = await fetch("http://localhost:4000/api/all");
  if (!res.ok) throw new Error("Failed to fetch calculations");
  return res.json();
}
