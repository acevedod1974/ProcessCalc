import { convertUnits } from "../exportUtils";

describe("exportUtils", () => {
  it.skip("should export to JSON without throwing (browser only)", () => {
    // Skipped: depends on document API
  });

  it.skip("should export to CSV without throwing (browser only)", () => {
    // Skipped: depends on alert API
  });

  it.skip("should export to PDF without throwing (browser only)", () => {
    // Skipped: depends on document API
  });

  it("should convert units for length and force", () => {
    expect(convertUnits(100, "mm", "cm")).toBeCloseTo(10);
    expect(convertUnits(1000, "N", "kN")).toBeCloseTo(1);
  });

  it.skip("should handle importFromJSON with a mock file (browser only)", async () => {
    // Skipped: depends on FileReader API
  });
});
