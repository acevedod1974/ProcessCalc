import { calculateRolling } from "../calculations";
import { calculatePunching } from "../cuttingCalculations";
import { calculateTurning } from "../machiningCalculations";
import { calculateWireDrawing } from "../drawingExtrusionCalculations";

// Integration test: Simulate a process chain from rolling to punching to machining to wire drawing

describe("ProcessCalc integration: rolling → punching → machining → wire drawing", () => {
  it("should handle rolling with extreme friction and check all outputs", () => {
    const result = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 30,
      finalThickness: 15,
      width: 120,
      rollDiameter: 350,
      rollingSpeed: 1.5,
      frictionCoefficient: 0.9, // extreme
    });
    expect(result.rollingForce).toBeGreaterThan(0);
    expect(result.rollingPower).toBeGreaterThan(0);
    expect(result).toHaveProperty("rollingForce");
    expect(result).toHaveProperty("rollingPower");
    expect(typeof result.rollingForce).toBe("number");
    expect(typeof result.rollingPower).toBe("number");
  });

  it("should handle punching with and without lubrication and check all outputs", () => {
    const withLube = calculatePunching({
      material: "steel-mild",
      thickness: 8,
      holeDiameter: 8,
      punchDiameter: 8,
      clearance: 8,
      punchSpeed: 80,
      temperature: 20,
      lubrication: true,
    });
    const noLube = calculatePunching({
      material: "steel-mild",
      thickness: 8,
      holeDiameter: 8,
      punchDiameter: 8,
      clearance: 8,
      punchSpeed: 80,
      temperature: 20,
      lubrication: false,
    });
    [withLube, noLube].forEach((res) => {
      expect(res.punchingForce).toBeGreaterThan(0);
      expect(res.strippingForce).toBeGreaterThan(0);
      expect(res.totalForce).toBeGreaterThan(0);
      expect(res.punchingEnergy).toBeGreaterThan(0);
      expect(res.punchingPower).toBeGreaterThan(0);
      expect(res.shearStress).toBeGreaterThan(0);
      expect(typeof res.cutQuality).toBe("string");
      expect(Array.isArray(res.recommendations)).toBe(true);
    });
  });

  it("should handle machining with alternate tool materials and check outputs", () => {
    const carbide = calculateTurning({
      material: "steel-mild",
      diameter: 12,
      length: 60,
      cuttingSpeed: 120,
      feedRate: 0.25,
      depthOfCut: 2.5,
      toolMaterial: "carbide",
      coolant: false,
    });
    const ceramic = calculateTurning({
      material: "steel-mild",
      diameter: 12,
      length: 60,
      cuttingSpeed: 120,
      feedRate: 0.25,
      depthOfCut: 2.5,
      toolMaterial: "ceramic",
      coolant: true,
    });
    [carbide, ceramic].forEach((res) => {
      expect(res.cuttingForce).toBeGreaterThan(0);
      expect(res.cuttingPower).toBeGreaterThan(0);
      expect(typeof res.surfaceRoughness).toBe("number");
      expect(typeof res.toolLife).toBe("number");
      expect(Array.isArray(res.recommendations)).toBe(true);
    });
  });

  it("should handle wire drawing with extreme temperature and check all outputs", () => {
    const result = calculateWireDrawing({
      material: "steel-low-carbon",
      initialDiameter: 12,
      finalDiameter: 6,
      drawingSpeed: 15,
      dieAngle: 10,
      numberOfPasses: 2,
      lubrication: false,
      temperature: 200, // extreme
    });
    expect(result.drawingForce).toBeGreaterThan(0);
    expect(result.drawingStress).toBeGreaterThan(0);
    expect(result.drawingPower).toBeGreaterThan(0);
    expect(result.dieStress).toBeGreaterThan(0);
    expect(result.workDone).toBeGreaterThan(0);
    expect(result.efficiency).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it("should throw for invalid toolMaterial in machining", () => {
    expect(() =>
      calculateTurning({
        material: "steel-mild",
        diameter: 10,
        length: 50,
        cuttingSpeed: 100,
        feedRate: 0.2,
        depthOfCut: 2,
        toolMaterial: "invalid" as any,
        coolant: true,
      })
    ).toThrow();
  });
  it("should throw if machining receives an invalid diameter", () => {
    // Step 1: Rolling
    calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    calculatePunching({
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
    calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    calculatePunching({
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
    calculateTurning({
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
    calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    // Step 2: Punching
    calculatePunching({
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
    calculateTurning({
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
    calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 0.1, // too thin for punching
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });

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
