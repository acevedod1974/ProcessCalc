import {
  calculateWireDrawing,
  calculateExtrusion,
} from "../drawingExtrusionCalculations";

describe("calculateWireDrawing", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateWireDrawing({
      material: "steel-low-carbon",
      initialDiameter: 10,
      finalDiameter: 5,
      numberOfPasses: 2,
      dieAngle: 8,
      drawingSpeed: 100,
      temperature: 20,
      lubrication: true,
    });
    expect(result).toHaveProperty("drawingForce");
    expect(result).toHaveProperty("drawingStress");
    expect(result.drawingForce).toBeGreaterThan(0);
    expect(result.drawingStress).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateWireDrawing({
        material: "fake-material",
        initialDiameter: 10,
        finalDiameter: 5,
        numberOfPasses: 2,
        dieAngle: 8,
        drawingSpeed: 100,
        temperature: 20,
        lubrication: true,
      })
    ).toThrow();
  });
});

describe("calculateExtrusion", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateExtrusion({
      material: "steel-low-carbon",
      billetDiameter: 50,
      billetLength: 200,
      extrudedDiameter: 20,
      extrusionSpeed: 10,
      dieAngle: 10,
      temperature: 20,
      lubrication: true,
      extrusionType: "direct",
    });
    expect(result).toHaveProperty("extrusionForce");
    expect(result).toHaveProperty("extrusionPressure");
    expect(result.extrusionForce).toBeGreaterThan(0);
    expect(result.extrusionPressure).toBeGreaterThan(0);
  });
  it("should throw if material is invalid", () => {
    expect(() =>
      calculateExtrusion({
        material: "fake-material",
        billetDiameter: 50,
        billetLength: 200,
        extrudedDiameter: 20,
        extrusionSpeed: 10,
        dieAngle: 10,
        temperature: 20,
        lubrication: true,
        extrusionType: "direct",
      })
    ).toThrow();
  });
});
