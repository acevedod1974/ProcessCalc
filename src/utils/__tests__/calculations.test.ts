describe("calculateRolling edge cases", () => {
  it("should throw if initialThickness <= finalThickness", () => {
    expect(() =>
      calculateRolling({
        material: "steel-low-carbon",
        initialThickness: 10,
        finalThickness: 10,
        width: 100,
        rollDiameter: 300,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
    expect(() =>
      calculateRolling({
        material: "steel-low-carbon",
        initialThickness: 8,
        finalThickness: 10,
        width: 100,
        rollDiameter: 300,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
  });
  it("should throw if width or rollDiameter is zero or negative", () => {
    expect(() =>
      calculateRolling({
        material: "steel-low-carbon",
        initialThickness: 20,
        finalThickness: 10,
        width: 0,
        rollDiameter: 300,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
    expect(() =>
      calculateRolling({
        material: "steel-low-carbon",
        initialThickness: 20,
        finalThickness: 10,
        width: 100,
        rollDiameter: 0,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
  });
});

describe("calculateForging edge cases", () => {
  it("should throw if initialHeight <= finalHeight", () => {
    expect(() =>
      calculateForging({
        material: "steel-low-carbon",
        initialHeight: 50,
        finalHeight: 50,
        diameter: 50,
        frictionCoefficient: 0.2,
        dieType: "flat",
      })
    ).toThrow();
    expect(() =>
      calculateForging({
        material: "steel-low-carbon",
        initialHeight: 40,
        finalHeight: 50,
        diameter: 50,
        frictionCoefficient: 0.2,
        dieType: "flat",
      })
    ).toThrow();
  });
  it("should throw if diameter is zero or negative", () => {
    expect(() =>
      calculateForging({
        material: "steel-low-carbon",
        initialHeight: 100,
        finalHeight: 50,
        diameter: 0,
        frictionCoefficient: 0.2,
        dieType: "flat",
      })
    ).toThrow();
  });
});

describe("Unit conversion utilities", () => {
  it("convertLength should convert mm to m and in to mm", () => {
    expect(convertLength(1000, "mm", "m")).toBe(1);
    expect(convertLength(2, "in", "mm")).toBeCloseTo(50.8);
  });
  it("convertForce should convert kN to N and lbf to N", () => {
    expect(convertForce(2, "kN", "N")).toBe(2000);
    expect(convertForce(10, "lbf", "N")).toBeCloseTo(44.48);
  });
  it("convertPower should convert kW to W and hp to W", () => {
    expect(convertPower(2, "kW", "W")).toBe(2000);
    expect(convertPower(1, "hp", "W")).toBeCloseTo(745.7);
  });
  it("should throw if unit is invalid", () => {
    expect(() => convertLength(1, "foo", "mm")).toThrow();
    expect(() => convertForce(1, "N", "bar")).toThrow();
    expect(() => convertPower(1, "baz", "W")).toThrow();
  });
});
import {
  calculateRolling,
  calculateForging,
  convertLength,
  convertForce,
  convertPower,
} from "../calculations";

describe("calculateRolling", () => {
  it("should return correct output for typical SI inputs", () => {
    // Adapted to match function signature: material as string, correct result keys
    const result = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    expect(result).toHaveProperty("rollingForce");
    expect(result).toHaveProperty("rollingPower");
    expect(result.rollingForce).toBeGreaterThan(0);
    expect(result.rollingPower).toBeGreaterThan(0);
  });

  it("should throw if material is invalid", () => {
    expect(() =>
      calculateRolling({
        material: "fake-material",
        initialThickness: 20,
        finalThickness: 10,
        width: 100,
        rollDiameter: 300,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
  });
});

describe("calculateForging", () => {
  it("should return correct output for typical SI inputs", () => {
    // Adapted to match function signature: material as string, correct result keys
    const result = calculateForging({
      material: "steel-low-carbon",
      initialHeight: 100,
      finalHeight: 50,
      diameter: 50,
      frictionCoefficient: 0.2,
      dieType: "flat",
    });
    expect(result).toHaveProperty("forgingForce");
    expect(result).toHaveProperty("workDone");
    expect(result.forgingForce).toBeGreaterThan(0);
    expect(result.workDone).toBeGreaterThan(0);
  });

  it("should throw if material is invalid", () => {
    expect(() =>
      calculateForging({
        material: "fake-material",
        initialHeight: 100,
        finalHeight: 50,
        diameter: 50,
        frictionCoefficient: 0.2,
        dieType: "flat",
      })
    ).toThrow();
  });
});

describe("calculateRolling", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateRolling({
      material: "steel-low-carbon",
      initialThickness: 20,
      finalThickness: 10,
      width: 100,
      rollDiameter: 300,
      rollingSpeed: 2,
      frictionCoefficient: 0.2,
    });
    expect(result).toHaveProperty("rollingForce");
    expect(result).toHaveProperty("rollingPower");
    expect(result.rollingForce).toBeGreaterThan(0);
    expect(result.rollingPower).toBeGreaterThan(0);
  });

  it("should throw if material is invalid", () => {
    expect(() =>
      calculateRolling({
        material: "fake-material",
        initialThickness: 20,
        finalThickness: 10,
        width: 100,
        rollDiameter: 300,
        rollingSpeed: 2,
        frictionCoefficient: 0.2,
      })
    ).toThrow();
  });
});

describe("calculateForging", () => {
  it("should return correct output for typical SI inputs", () => {
    const result = calculateForging({
      material: "steel-low-carbon",
      initialHeight: 100,
      finalHeight: 50,
      diameter: 50,
      frictionCoefficient: 0.2,
      dieType: "flat",
    });
    expect(result).toHaveProperty("forgingForce");
    expect(result).toHaveProperty("workDone");
    expect(result.forgingForce).toBeGreaterThan(0);
    expect(result.workDone).toBeGreaterThan(0);
  });

  it("should throw if material is invalid", () => {
    expect(() =>
      calculateForging({
        material: "fake-material",
        initialHeight: 100,
        finalHeight: 50,
        diameter: 50,
        frictionCoefficient: 0.2,
        dieType: "flat",
      })
    ).toThrow();
  });
});
