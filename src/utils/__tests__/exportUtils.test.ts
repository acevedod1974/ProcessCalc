import {
  exportToJSON,
  exportToCSV,
  exportToPDF,
  importFromJSON,
  convertUnits,
} from "../exportUtils";

describe("exportUtils", () => {
  it("should export to JSON without throwing", () => {
    expect(() =>
      exportToJSON({
        projects: [],
        calculations: [],
        settings: {},
        exportDate: new Date().toISOString(),
        version: "1.0.0",
      })
    ).not.toThrow();
  });

  it("should export to CSV without throwing", () => {
    expect(() => exportToCSV([])).not.toThrow();
  });

  it("should export to PDF without throwing", () => {
    expect(() => exportToPDF([], [])).not.toThrow();
  });

  it("should convert units for length and force", () => {
    expect(convertUnits(100, "mm", "cm")).toBeCloseTo(10);
    expect(convertUnits(1000, "N", "kN")).toBeCloseTo(1);
  });

  it("should handle importFromJSON with a mock file", async () => {
    const file = new File(
      [
        JSON.stringify({
          projects: [],
          calculations: [],
          settings: {},
          exportDate: new Date().toISOString(),
          version: "1.0.0",
        }),
      ],
      "test.json",
      { type: "application/json" }
    );
    const data = await importFromJSON(file);
    expect(data).toHaveProperty("projects");
    expect(data).toHaveProperty("calculations");
    expect(data).toHaveProperty("settings");
    expect(data).toHaveProperty("exportDate");
    expect(data).toHaveProperty("version");
  });
});
