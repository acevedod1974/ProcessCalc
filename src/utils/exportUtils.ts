// Export utilities for ProcessCalc

// Define html2pdf interface for type safety
interface Html2Pdf {
  (): {
    set: (options: unknown) => {
      from: (element: HTMLElement) => {
        save: () => Promise<void>;
      };
    };
  };
}

declare global {
  interface Window {
    html2pdf?: Html2Pdf;
  }
}

export interface ExportCalculation {
  id: string;
  name: string;
  type: string;
  material: string;
  timestamp: string | number;
  projectId?: string;
  parameters?: Record<string, unknown>;
  results?: Record<string, unknown>;
}

export interface ExportProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string | number;
  calculations?: ExportCalculation[];
}

export interface ExportSettings {
  [key: string]: unknown;
}

export interface ExportData {
  calculations: ExportCalculation[];
  projects: ExportProject[];
  settings: ExportSettings;
  exportDate: string;
  version: string;
}

export function exportToJSON(data: ExportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadFile(blob, `processcalc-export-${formatDate(new Date())}.json`);
}

export function exportToCSV(calculations: ExportCalculation[]): void {
  if (calculations.length === 0) {
    alert("No calculations to export");
    return;
  }

  // Get all unique keys from calculations
  const allKeys = new Set<string>();
  calculations.forEach((calc) => {
    Object.keys(calc.parameters || {}).forEach((key) =>
      allKeys.add(`param_${key}`)
    );
    Object.keys(calc.results || {}).forEach((key) =>
      allKeys.add(`result_${key}`)
    );
    ["id", "name", "type", "material", "timestamp", "projectId"].forEach(
      (key) => allKeys.add(key)
    );
  });

  const headers = Array.from(allKeys).sort();

  // Strengthened escape function using tab separation and enhanced security
  const escapeTsv = (value: unknown) => {
    let str = String(value ?? "");

    // Prevent formula injection attacks
    if (["=", "+", "-", "@", "\t", "\r", "\n"].includes(str[0])) {
      str = "'" + str;
    }

    // Escape tabs, newlines, and carriage returns for TSV format
    str = str
      .replace(/\t/g, "\\t") // Replace actual tabs with escaped tabs
      .replace(/\r/g, "\\r") // Replace carriage returns
      .replace(/\n/g, "\\n") // Replace newlines
      .replace(/\\/g, "\\\\"); // Escape backslashes

    return str;
  };

  // Use tab-separated values (TSV) format for enhanced security
  const tsvContent = [
    headers.join("\t"),
    ...calculations.map((calc) =>
      headers
        .map((header) => {
          if (header.startsWith("param_")) {
            const paramKey = header.replace("param_", "");
            return escapeTsv(calc.parameters?.[paramKey]);
          } else if (header.startsWith("result_")) {
            const resultKey = header.replace("result_", "");
            return escapeTsv(calc.results?.[resultKey]);
          } else {
            return escapeTsv(calc[header as keyof ExportCalculation]);
          }
        })
        .join("\t")
    ),
  ].join("\n");

  const blob = new Blob([tsvContent], { type: "text/tab-separated-values" });
  downloadFile(blob, `processcalc-calculations-${formatDate(new Date())}.tsv`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportToPDF(
  calculations: ExportCalculation[],
  projects: ExportProject[]
): void {
  // Create a secure HTML report with escaped content for html2pdf.js
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; margin: 20px; max-width: 800px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333;">ProcessCalc Report</h1>
        <p style="color: #666;">Generated on: ${escapeHtml(
          new Date().toLocaleString()
        )}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">Projects (${
          projects.length
        })</h2>
        ${projects
          .map(
            (project) => `
          <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;">
            <h3 style="color: #666; margin-top: 0;">${escapeHtml(
              project.name
            )}</h3>
            <p style="margin: 5px 0;">${escapeHtml(
              project.description || ""
            )}</p>
            <p style="margin: 5px 0;"><strong>Created:</strong> ${escapeHtml(
              new Date(project.createdAt).toLocaleDateString()
            )}</p>
            <p style="margin: 5px 0;"><strong>Calculations:</strong> ${escapeHtml(
              String(project.calculations?.length || 0)
            )}</p>
          </div>
        `
          )
          .join("")}
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 5px;">Calculations (${
          calculations.length
        })</h2>
        ${calculations
          .map(
            (calc) => `
          <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; page-break-inside: avoid;">
            <h3 style="color: #666; margin-top: 0;">${escapeHtml(
              calc.name
            )}</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${escapeHtml(
              calc.type
            )}</p>
            <p style="margin: 5px 0;"><strong>Material:</strong> ${escapeHtml(
              calc.material
            )}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${escapeHtml(
              new Date(calc.timestamp).toLocaleDateString()
            )}</p>
            
            <h4 style="color: #666; margin: 15px 0 10px 0;">Parameters</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
              ${Object.entries(calc.parameters || {})
                .map(
                  ([key, value]) => `
                <tr><td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;">${escapeHtml(
                  key
                )}</td><td style="border: 1px solid #ddd; padding: 8px;">${escapeHtml(
                    String(value)
                  )}</td></tr>
              `
                )
                .join("")}
            </table>
            
            <h4 style="color: #666; margin: 15px 0 10px 0;">Results</h4>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px;">
              ${Object.entries(calc.results || {})
                .map(
                  ([key, value]) => `
                <tr><td style="border: 1px solid #ddd; padding: 8px; background-color: #f9f9f9;">${escapeHtml(
                  key
                )}</td><td style="border: 1px solid #ddd; padding: 8px;">${escapeHtml(
                    String(value)
                  )}</td></tr>
              `
                )
                .join("")}
            </table>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  // Use html2pdf.js for secure PDF generation
  if (typeof window !== "undefined" && window.html2pdf) {
    // Create a temporary element with the content
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    document.body.appendChild(element);

    const opt = {
      margin: 1,
      filename: `processcalc-report-${formatDate(new Date())}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    window
      .html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  } else {
    // Fallback: download as HTML file if html2pdf.js is not available
    const blob = new Blob(
      [
        `<!DOCTYPE html><html><head><title>ProcessCalc Report</title></head><body>${htmlContent}</body></html>`,
      ],
      {
        type: "text/html",
      }
    );
    downloadFile(blob, `processcalc-report-${formatDate(new Date())}.html`);
    console.warn(
      "html2pdf.js not available. Report exported as HTML file instead."
    );
  }
}

export function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Unit conversion utilities
export function convertUnits(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  type UnitMap = Record<string, number>;
  type TempMap = Record<string, (val: number, to: string) => number>;
  const conversions: { [key: string]: UnitMap | TempMap } = {
    length: {
      mm: 1,
      cm: 10,
      m: 1000,
      in: 25.4,
      ft: 304.8,
    },
    force: {
      N: 1,
      kN: 1000,
      MN: 1000000,
      lbf: 4.448,
      kip: 4448,
    },
    pressure: {
      Pa: 1,
      kPa: 1000,
      MPa: 1000000,
      psi: 6895,
      ksi: 6895000,
    },
    power: {
      W: 1,
      kW: 1000,
      MW: 1000000,
      hp: 745.7,
    },
    temperature: {
      "°C": (val: number, to: string) => {
        if (to === "°F") return (val * 9) / 5 + 32;
        if (to === "K") return val + 273.15;
        return val;
      },
      "°F": (val: number, to: string) => {
        if (to === "°C") return ((val - 32) * 5) / 9;
        if (to === "K") return ((val - 32) * 5) / 9 + 273.15;
        return val;
      },
      K: (val: number, to: string) => {
        if (to === "°C") return val - 273.15;
        if (to === "°F") return ((val - 273.15) * 9) / 5 + 32;
        return val;
      },
    },
  };

  // Find the unit category
  for (const [category, units] of Object.entries(conversions)) {
    if (category === "temperature") {
      const tempUnits = units as TempMap;
      const converter = tempUnits[fromUnit];
      if (typeof converter === "function") {
        return converter(value, toUnit);
      }
    } else {
      const unitMap = units as UnitMap;
      if (unitMap[fromUnit] && unitMap[toUnit]) {
        return (value * unitMap[fromUnit]) / unitMap[toUnit];
      }
    }
  }

  return value; // Return original value if conversion not found
}
