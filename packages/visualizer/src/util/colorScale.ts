const colorMap = {
  fast: '#00ff00',
  medium: '#ffff00',
  slow: '#ff0000',
};

export function getColor(segmentTime: number, totalTime: number) {
  return interpolateColor(segmentTime / totalTime);
}

export function interpolateColor(value: number): string {
  if (value < 0 || value > 1) {
    throw new Error('Value must be between 0 and 1');
  }

  if (value <= 0.5) {
    const ratio = value / 0.5;
    return interpolateHexColor(colorMap.fast, colorMap.medium, ratio);
  } else {
    const ratio = (value - 0.5) / 0.5;
    return interpolateHexColor(colorMap.medium, colorMap.slow, ratio);
  }
}

function interpolateHexColor(
  start: string,
  end: string,
  ratio: number
): string {
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  const r = Math.max(
    Math.min(
      parseInt(start.slice(1, 3), 16) * (1 - ratio) +
        parseInt(end.slice(1, 3), 16) * ratio,
      255
    ),
    0
  );
  const g = Math.max(
    Math.min(
      parseInt(start.slice(3, 5), 16) * (1 - ratio) +
        parseInt(end.slice(3, 5), 16) * ratio,
      255
    ),
    0
  );
  const b = Math.max(
    Math.min(
      parseInt(start.slice(5, 7), 16) * (1 - ratio) +
        parseInt(end.slice(5, 7), 16) * ratio,
      255
    ),
    0
  );
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}
