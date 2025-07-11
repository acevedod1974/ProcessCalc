import { calculateRolling } from "../calculations";
import { calculatePunching } from "../cuttingCalculations";
import { calculateTurning } from "../machiningCalculations";
import { calculateWireDrawing } from "../drawingExtrusionCalculations";

// Integration test: Simulate a process chain from rolling to punching to machining to wire drawing

describe("ProcessCalc integration: rolling → punching → machining → wire drawing", () => {
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
      material: "steel-low-carbon",
      thickness: 10, // from rolling
      length: 50,
      width: 20,
      clearance: 0.2,
    });
    expect(punchingResult.force).toBeGreaterThan(0);
    expect(punchingResult.work).toBeGreaterThan(0);

    // Step 3: Machining (turning, use punched thickness as diameter)
    const machiningResult = calculateTurning({
      material: "steel-low-carbon",
      diameter: 10, // from rolling
      length: 50, // from punching
      cuttingSpeed: 100,
      feed: 0.2,
      depthOfCut: 2,
    });
    expect(machiningResult.force).toBeGreaterThan(0);
    expect(machiningResult.power).toBeGreaterThan(0);

    // Step 4: Wire Drawing (use machined diameter as initial diameter)
    const wireDrawingResult = calculateWireDrawing({
      material: "steel-low-carbon",
      initialDiameter: 10, // from machining
      finalDiameter: 5,
      dieAngle: 8,
      frictionCoefficient: 0.1,
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
        material: "steel-low-carbon",
        thickness: 0.1, // too thin
        length: 50,
        width: 20,
        clearance: 0.2,
      })
    ).toThrow();
  });
});
