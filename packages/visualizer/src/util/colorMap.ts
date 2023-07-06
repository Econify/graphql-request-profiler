const colors = [
  '#147df5',
  '#ff0000',
  '#ffd300',
  '#a1ff0a',
  '#0aefff',
  '#2d00f7',
  '#ff4800',
  '#ffb600',
  '#f20089',
  '#6a00f4',
  '#ff9e00',
  '#ff5400',
  '#8900f2',
  '#ff6000',
  '#a100f2',
  '#ff6d00',
  '#b100e8',
  '#d100d1',
  '#ff9100',
];

const colorMap = new Map<string, string>();

export function getColor(key: string): string {
  if (!colorMap.has(key)) {
    colorMap.set(key, colors[colorMap.size % colors.length]);
  }

  return colorMap.get(key)!;
}
