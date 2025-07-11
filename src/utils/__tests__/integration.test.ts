import { calculateRolling } from "../calculations";
import { calculatePunching } from "../cuttingCalculations";
import { calculateTurning } from "../machiningCalculations";
import { calculateWireDrawing } from "../drawingExtrusionCalculations";

// Integration test: Simulate a process chain from rolling to punching to machining to wire drawing

describe("ProcessCalc integration: rolling → punching → machining → wire drawing", () => {
  it("should throw if machining receives an invalid diameter", () => {
    // Step 1: Rolling
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    const punchingResult = calculatePunching({
      material: "steel-mild",
      thickness: 10,
      holeDiameter: 10,
      punchDiameter: 10,
      clearance: 10,
      punchSpeed: 100,
      temperature: 25,
      lubrication: true,
    });
    // Step 3: Machining with invalid diameter (zero)
    expect(() =>
      calculateTurning({
        material: "steel-mild",
        diameter: 0,
        length: 50,
        cuttingSpeed: 100,
        feedRate: 0.2,
        depthOfCut: 2,
        toolMaterial: "hss",
        coolant: true,
      })
    ).toThrow();
  });

  it("should throw if wire drawing receives impossible diameters", () => {
    // Step 1: Rolling
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    const punchingResult = calculatePunching({
      material: "steel-mild",
      thickness: 10,
      holeDiameter: 10,
      punchDiameter: 10,
      clearance: 10,
      punchSpeed: 100,
      temperature: 25,
      lubrication: true,
    });
    // Step 3: Machining
    const machiningResult = calculateTurning({
      material: "steel-mild",
      diameter: 10,
      length: 50,
      cuttingSpeed: 100,
      feedRate: 0.2,
      depthOfCut: 2,
      toolMaterial: "hss",
      coolant: true,
    });
    // Step 4: Wire Drawing with impossible diameters (final > initial)
    expect(() =>
      calculateWireDrawing({
        material: "steel-low-carbon",
        initialDiameter: 5,
        finalDiameter: 10,
        drawingSpeed: 10,
        dieAngle: 8,
        numberOfPasses: 1,
        lubrication: true,
        temperature: 25,
      })
    ).toThrow();
  });

  it("should throw if wire drawing receives an invalid material", () => {
    // Step 1: Rolling
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    const punchingResult = calculatePunching({
      material: "steel-mild",
      thickness: 10,
      holeDiameter: 10,
      punchDiameter: 10,
      clearance: 10,
      punchSpeed: 100,
      temperature: 25,
      lubrication: true,
    });
    // Step 3: Machining
    const machiningResult = calculateTurning({
      material: "steel-mild",
      diameter: 10,
      length: 50,
      cuttingSpeed: 100,
      feedRate: 0.2,
      depthOfCut: 2,
      toolMaterial: "hss",
      coolant: true,
    });
    // Step 4: Wire Drawing with invalid material
    expect(() =>
      calculateWireDrawing({
        material: "not-a-material",
        initialDiameter: 10,
        finalDiameter: 5,
        drawingSpeed: 10,
        dieAngle: 8,
        numberOfPasses: 1,
        lubrication: true,
        temperature: 25,
      })
    ).toThrow();
  });

  it("should propagate recommendations and quality indicators", () => {
    // Step 1: Rolling
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    const punchingResult = calculatePunching({
      material: "steel-mild",
      thickness: 10,
      holeDiameter: 10,
      punchDiameter: 10,
      clearance: 10,
      punchSpeed: 100,
      temperature: 25,
      lubrication: true,
    });
    expect(typeof punchingResult.cutQuality).toBe("string");
    expect(Array.isArray(punchingResult.recommendations)).toBe(true);
    expect(punchingResult.recommendations.length).toBeGreaterThan(0);
    // Step 3: Machining
    const machiningResult = calculateTurning({
      material: "steel-mild",
      diameter: 10,
      length: 50,
      cuttingSpeed: 100,
      feedRate: 0.2,
      depthOfCut: 2,
      toolMaterial: "hss",
      coolant: true,
    });
    expect(Array.isArray(machiningResult.recommendations)).toBe(true);
    expect(machiningResult.recommendations.length).toBeGreaterThan(0);
    // Step 4: Wire Drawing
    const wireDrawingResult = calculateWireDrawing({
      material: "steel-low-carbon",
      initialDiameter: 10,
      finalDiameter: 5,
      drawingSpeed: 10,
      dieAngle: 8,
      numberOfPasses: 1,
      lubrication: true,
      temperature: 25,
    });
    expect(Array.isArray(wireDrawingResult.recommendations)).toBe(true);
    expect(wireDrawingResult.recommendations.length).toBeGreaterThan(0);
  });
  it("should process a realistic workflow and propagate results", () => {
    // Step 1: Rolling
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    expect(rollingResult.rollingForce).toBeGreaterThan(0);
    expect(rollingResult.rollingPower).toBeGreaterThan(0);

    // Step 2: Punching (use rolled thickness)
    const punchingResult = calculatePunching({
      material: "steel-mild",
      thickness: 10, // from rolling
      holeDiameter: 10,
      punchDiameter: 10,
      clearance: 10, // percent of thickness
      punchSpeed: 100,
      temperature: 25,
      lubrication: true,
    });
    expect(punchingResult.punchingForce).toBeGreaterThan(0);
    expect(punchingResult.punchingPower).toBeGreaterThan(0);

    // Step 3: Machining (turning, use punched thickness as diameter)
    const machiningResult = calculateTurning({
      material: "steel-mild",
      diameter: 10, // from rolling
      length: 50, // arbitrary
      cuttingSpeed: 100,
      feedRate: 0.2,
      depthOfCut: 2,
      toolMaterial: "hss",
      coolant: true,
    });
    expect(machiningResult.cuttingForce).toBeGreaterThan(0);
    expect(machiningResult.cuttingPower).toBeGreaterThan(0);

    // Step 4: Wire Drawing (use machined diameter as initial diameter)
    const wireDrawingResult = calculateWireDrawing({
      material: "steel-low-carbon",
      initialDiameter: 10, // from machining
      finalDiameter: 5,
      drawingSpeed: 10,
      dieAngle: 8,
      numberOfPasses: 1,
      lubrication: true,
      temperature: 25,
    });
    expect(wireDrawingResult.drawingForce).toBeGreaterThan(0);
    expect(wireDrawingResult.workDone).toBeGreaterThan(0);
  });

  it("should throw if an intermediate step produces invalid input for the next", () => {
    // Step 1: Rolling with invalid output (finalThickness too small for next step)
    const rollingResult = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 0.1, // too thin for punching
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    expect(rollingResult.rollingForce).toBeGreaterThan(0);
    expect(rollingResult.rollingPower).toBeGreaterThan(0);

    // Step 2: Punching should throw due to invalid thickness
    expect(() =>
      calculatePunching({
        material: "steel-mild",
        thickness: 0.1, // too thin
        holeDiameter: 10,
        punchDiameter: 10,
        clearance: 10,
        punchSpeed: 100,
        temperature: 25,
        lubrication: true,
      })
    ).toThrow();
  });
});
