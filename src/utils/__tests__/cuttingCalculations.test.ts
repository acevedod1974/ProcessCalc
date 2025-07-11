import {
  calculatePunching,
  calculateShearing,
  optimizeClearance,
} from "../cuttingCalculations";

describe("calculatePunching", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculatePunching({
      material: "steel-mild",
      thickness: 5,
      holeDiameter: 20,
      punchDiameter: 19.5,
      clearance: 10,
      punchSpeed: 100,
      temperature: 20,
      lubrication: true,
    });
    expect(result).toHaveProperty("punchingForce");
    expect(result).toHaveProperty("cutQuality");
    expect(result.punchingForce).toBeGreaterThan(0);
    expect(["Excellent", "Good", "Fair", "Poor"]).toContain(result.cutQuality);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculatePunching({
        material: "fake-material",
        thickness: 5,
        holeDiameter: 20,
        punchDiameter: 19.5,
        clearance: 10,
        punchSpeed: 100,
        temperature: 20,
        lubrication: true,
      })
    ).toThrow();
  });
});

describe("calculateShearing", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateShearing({
      material: "steel-mild",
      thickness: 5,
      shearLength: 100,
      bladeAngle: 5,
      clearance: 10,
      shearSpeed: 100,
      holdDownForce: 1000,
    });
    expect(result).toHaveProperty("shearingForce");
    expect(result).toHaveProperty("holdDownPressure");
    expect(result.shearingForce).toBeGreaterThan(0);
    expect(result.holdDownPressure).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateShearing({
        material: "fake-material",
        thickness: 5,
        shearLength: 100,
        bladeAngle: 5,
        clearance: 10,
        shearSpeed: 100,
        holdDownForce: 1000,
      })
    ).toThrow();
  });
});

describe("optimizeClearance", () => {
  it("should return optimal clearance for valid material", () => {
    const result = optimizeClearance("steel-mild", 5);
    expect(result).toHaveProperty("optimal");
    expect(result.optimal).toBeGreaterThan(0);
  });
  it("should return null for invalid material", () => {
    expect(optimizeClearance("fake-material", 5)).toBeNull();
  });
});
