import type { TDataPoint, TSortFunction, TSortOption } from '../types';

export const sortFunctions: Record<TSortOption, TSortFunction> = {
  asc: (a: TDataPoint, b: TDataPoint) => (a.execTimeMs > b.execTimeMs ? 1 : -1),
  desc: (a: TDataPoint, b: TDataPoint) =>
    a.execTimeMs < b.execTimeMs ? 1 : -1,
  time: (a: TDataPoint, b: TDataPoint) =>
    a.execStartTimeMs > b.execStartTimeMs ? 1 : -1,
};
