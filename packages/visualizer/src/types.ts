export type TSortOption = 'asc' | 'desc' | 'time';

export type TColorsOption = 'time' | 'type' | 'none';

export type TSortFunction = (a: TDataPoint, b: TDataPoint) => number;

export type TDataPoint = {
  execTimeMs: number;
  execStartTimeMs: number;
  execEndTimeMs: number;
  location: string;
  parentType: string;
};
