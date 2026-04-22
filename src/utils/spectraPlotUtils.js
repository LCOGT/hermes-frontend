import _ from 'lodash';

export const baseLayout = {
  margin: { r: 20, b: 40, l: 80 },
  plot_bgcolor: "#1f1f1f",
  paper_bgcolor: "#1f1f1f",
  title: {
    text: 'Spectrum Plot',
    font: { size: 26, color: "#ffffff" },
    yref: 'paper',
    automargin: true
  },
  yaxis: {
    title: { text: 'Flux' },
    tickformat: '.1e',
    type: 'linear',
    gridcolor: '#444444',
    color: '#ffffff'
  },
  xaxis: {
    title: { text: 'Wavelength' },
    gridcolor: '#444444',
    color: '#ffffff',
    showgrid: false
  },
  legend: { x: 0.85, y: 1.0 }
};

export const previewLayoutOverrides = {
  height: 200,
  margin: { r: 10, b: 35, l: 65, t: 15 },
  title: { text: '', font: { size: 0, color: "#ffffff" }, yref: 'paper', automargin: false },
  legend: { x: 0.7, y: 1.0, font: { size: 10 } }
};

export function isSpectraTextFile(filename) {
  const lower = filename.toLowerCase();
  return lower.endsWith('.txt') || lower.endsWith('.ascii') || lower.endsWith('.text');
}

export function parseSpectraText(text) {
  const lines = text.split('\n');
  const fluxArray = [];
  const wavelengthArray = [];
  for (const line of lines) {
    const lineparts = line.trim().split(/[\t\s]+/);
    if (lineparts.length >= 2) {
      const wavelength = parseFloat(lineparts[0]);
      const flux = parseFloat(lineparts[1]);
      if (!isNaN(wavelength) && !isNaN(flux)) {
        wavelengthArray.push(wavelength);
        fluxArray.push(flux);
      }
    }
  }
  return { fluxArray, wavelengthArray };
}

export function buildSpectraPlotData(fluxArray, fluxUnits, fluxErrorArray, wavelengthArray, wavelengthUnits, title, layoutOverrides = {}) {
  const plotData = {
    x: wavelengthArray,
    y: fluxArray,
    type: 'scatter',
    name: title,
    exponentformat: 'e',
    mode: 'lines'
  };
  if (!_.isNil(fluxErrorArray) && _.isArray(fluxErrorArray) && !_.every(fluxErrorArray, x => x == 0)) {
    const fluxErrorLabels = _.clone(fluxErrorArray).map(v => '\u{00B1} ' + v.toString());
    plotData.text = fluxErrorLabels;
  }
  const layout = _.merge(_.cloneDeep(baseLayout), layoutOverrides);
  layout.xaxis.title.text = 'Wavelength';
  if (wavelengthUnits) {
    layout.xaxis.title.text += ' (' + wavelengthUnits + ')';
  }
  layout.yaxis.title.text = 'Flux';
  if (fluxUnits) {
    layout.yaxis.title.text += ' (' + fluxUnits + ')';
  }

  if (!layoutOverrides.title) {
    layout.title.text = title;
  }
  return { plotData, layout };
}

export async function loadSpectraFromUrl(url) {
  const response = await fetch(url, { method: 'get' });
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  return parseSpectraText(await response.text());
}

export function loadSpectraFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(parseSpectraText(e.target.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
