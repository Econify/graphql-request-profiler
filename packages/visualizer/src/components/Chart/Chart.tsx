import { type Component } from 'solid-js';
import type { TColorsOption, TDataPoint, TSortOption } from '../../types';

import styles from './Chart.module.css';
import { Segment } from '../Segment/Segment';
import { Timeline } from '../Timeline/Timeline';
import { sortFunctions } from '../../util/sort';

export interface IChartProps {
  filter: string;
  scale: number;
  sort: TSortOption;
  colors: TColorsOption;
  data: TDataPoint[];
}

function getFilterString(item: TDataPoint) {
  return (
    JSON.stringify(item) +
    Object.entries(item)
      .map(([key, value]) => `${key}:${value}`)
      .join(' ') +
    Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' ')
  ).toLowerCase();
}

const Chart: Component<IChartProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;

  const calcSegmentData = () => {
    const filteredData = props.data.filter((item) =>
      getFilterString(item).includes(props.filter.toLowerCase())
    );
    return filteredData.sort(sortFunctions[props.sort]);
  };

  const calcTotalTime = () => {
    return Math.max(...props.data.map((item) => item.execEndTimeMs));
  };

  return (
    <div ref={containerRef} class={styles.chart}>
      <Timeline
        totalTimeMs={calcTotalTime()}
        scale={props.scale}
        containerRef={containerRef}
      >
        {calcSegmentData().map((item) => (
          <Segment
            scale={props.scale}
            data={item}
            colors={props.colors}
            totalTimeMs={calcTotalTime()}
          />
        ))}
      </Timeline>
    </div>
  );
};

export default Chart;
