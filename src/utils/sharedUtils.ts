// Shared validation and recommendation utilities for ProcessCalc

export function validateMaterial<T extends { [key: string]: unknown }>(
  materials: Record<string, T>,
  materialKey: string
): T {
  const material = materials[materialKey];
  if (!material) {
    throw new Error("Material not found");
  }
  return material;
}

/**
 * Generic recommendation generator for numeric result checks.
 * @param checks Array of { condition, message } objects
 * @param fallback Message if no checks are triggered
 */
export function generateRecommendations(
  checks: { condition: boolean; message: string }[],
  fallback: string
): string[] {
  const recommendations = checks
    .filter((c) => c.condition)
    .map((c) => c.message);
  if (recommendations.length === 0) recommendations.push(fallback);
  return recommendations;
}
