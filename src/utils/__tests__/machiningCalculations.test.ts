import {
  calculateTurning,
  calculateMilling,
  calculateDrilling,
} from "../machiningCalculations";

describe("calculateTurning", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateTurning({
      material: "steel-mild",
      diameter: 50,
      length: 100,
      cuttingSpeed: 80,
      feedRate: 0.2,
      depthOfCut: 2,
      toolMaterial: "carbide",
      coolant: true,
    });
    expect(result).toHaveProperty("spindleSpeed");
    expect(result).toHaveProperty("cuttingForce");
    expect(result.spindleSpeed).toBeGreaterThan(0);
    expect(result.cuttingForce).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateTurning({
        material: "fake-material",
        diameter: 50,
        length: 100,
        cuttingSpeed: 80,
        feedRate: 0.2,
        depthOfCut: 2,
        toolMaterial: "carbide",
        coolant: true,
      })
    ).toThrow();
  });
});

describe("calculateMilling", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateMilling({
      material: "steel-mild",
      width: 20,
      length: 100,
      depth: 2,
      cutterDiameter: 10,
      numberOfTeeth: 4,
      spindleSpeed: 1200,
      feedRate: 200,
      toolMaterial: "carbide",
    });
    expect(result).toHaveProperty("cuttingSpeed");
    expect(result).toHaveProperty("cuttingPower");
    expect(result.cuttingSpeed).toBeGreaterThan(0);
    expect(result.cuttingPower).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateMilling({
        material: "fake-material",
        width: 20,
        length: 100,
        depth: 2,
        cutterDiameter: 10,
        numberOfTeeth: 4,
        spindleSpeed: 1200,
        feedRate: 200,
        toolMaterial: "carbide",
      })
    ).toThrow();
  });
});

describe("calculateDrilling", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateDrilling({
      material: "steel-mild",
      holeDiameter: 10,
      holeDepth: 50,
      drillSpeed: 800,
      feedRate: 0.1,
      toolMaterial: "carbide",
      coolant: true,
    });
    expect(result).toHaveProperty("cuttingSpeed");
    expect(result).toHaveProperty("thrustForce");
    expect(result.cuttingSpeed).toBeGreaterThan(0);
    expect(result.thrustForce).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateDrilling({
        material: "fake-material",
        holeDiameter: 10,
        holeDepth: 50,
        drillSpeed: 800,
        feedRate: 0.1,
        toolMaterial: "carbide",
        coolant: true,
      })
    ).toThrow();
  });
});
