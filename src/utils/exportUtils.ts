// Export utilities for ProcessCalc

export interface ExportData {
  calculations: any[];
  projects: any[];
  settings: any;
  exportDate: string;
  version: string;
}

export function exportToJSON(data: ExportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadFile(blob, `processcalc-export-${formatDate(new Date())}.json`);
}

export function exportToCSV(calculations: any[]): void {
  if (calculations.length === 0) {
    alert('No calculations to export');
    return;
  }

  // Get all unique keys from calculations
  const allKeys = new Set<string>();
  calculations.forEach(calc => {
    Object.keys(calc.parameters || {}).forEach(key => allKeys.add(`param_${key}`));
    Object.keys(calc.results || {}).forEach(key => allKeys.add(`result_${key}`));
    ['id', 'name', 'type', 'material', 'timestamp', 'projectId'].forEach(key => allKeys.add(key));
  });

  const headers = Array.from(allKeys).sort();
  const csvContent = [
    headers.join(','),
    ...calculations.map(calc => 
      headers.map(header => {
        if (header.startsWith('param_')) {
          const paramKey = header.replace('param_', '');
          return calc.parameters?.[paramKey] || '';
        } else if (header.startsWith('result_')) {
          const resultKey = header.replace('result_', '');
          return calc.results?.[resultKey] || '';
        } else {
          return calc[header] || '';
        }
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(blob, `processcalc-calculations-${formatDate(new Date())}.csv`);
}

export function exportToPDF(calculations: any[], projects: any[]): void {
  // Create a simple HTML report
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ProcessCalc Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .calculation { border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; }
        .project { background-color: #f5f5f5; padding: 15px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ProcessCalc Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="section">
        <h2>Projects (${projects.length})</h2>
        ${projects.map(project => `
          <div class="project">
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <p><strong>Created:</strong> ${new Date(project.createdAt).toLocaleDateString()}</p>
            <p><strong>Calculations:</strong> ${project.calculations?.length || 0}</p>
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2>Calculations (${calculations.length})</h2>
        ${calculations.map(calc => `
          <div class="calculation">
            <h3>${calc.name}</h3>
            <p><strong>Type:</strong> ${calc.type}</p>
            <p><strong>Material:</strong> ${calc.material}</p>
            <p><strong>Date:</strong> ${new Date(calc.timestamp).toLocaleDateString()}</p>
            
            <h4>Parameters</h4>
            <table>
              ${Object.entries(calc.parameters || {}).map(([key, value]) => `
                <tr><td>${key}</td><td>${value}</td></tr>
              `).join('')}
            </table>
            
            <h4>Results</h4>
            <table>
              ${Object.entries(calc.results || {}).map(([key, value]) => `
                <tr><td>${key}</td><td>${value}</td></tr>
              `).join('')}
            </table>
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

export function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Unit conversion utilities
export function convertUnits(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, number>> = {
    length: {
      'mm': 1,
      'cm': 10,
      'm': 1000,
      'in': 25.4,
      'ft': 304.8
    },
    force: {
      'N': 1,
      'kN': 1000,
      'MN': 1000000,
      'lbf': 4.448,
      'kip': 4448
    },
    pressure: {
      'Pa': 1,
      'kPa': 1000,
      'MPa': 1000000,
      'psi': 6895,
      'ksi': 6895000
    },
    power: {
      'W': 1,
      'kW': 1000,
      'MW': 1000000,
      'hp': 745.7
    },
    temperature: {
      '°C': (val: number, to: string) => {
        if (to === '°F') return (val * 9/5) + 32;
        if (to === 'K') return val + 273.15;
        return val;
      },
      '°F': (val: number, to: string) => {
        if (to === '°C') return (val - 32) * 5/9;
        if (to === 'K') return ((val - 32) * 5/9) + 273.15;
        return val;
      },
      'K': (val: number, to: string) => {
        if (to === '°C') return val - 273.15;
        if (to === '°F') return ((val - 273.15) * 9/5) + 32;
        return val;
      }
    }
  };

  // Find the unit category
  for (const [category, units] of Object.entries(conversions)) {
    if (category === 'temperature') {
      const converter = units[fromUnit];
      if (typeof converter === 'function') {
        return converter(value, toUnit);
      }
    } else {
      if (units[fromUnit] && units[toUnit]) {
        return (value * units[fromUnit]) / units[toUnit];
      }
    }
  }

  return value; // Return original value if conversion not found
}