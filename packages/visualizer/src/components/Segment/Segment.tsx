import { createSignal, type Component, type JSX, onMount } from 'solid-js';
import type { TColorsOption, TDataPoint } from '../../types';

import cx from 'classnames';
import { getColor as getTimePerformanceColor } from '../../util/colorScale';
import { getColor as getMapColor } from '../../util/colorMap';
import styles from './Segment.module.css';
import { Tooltip } from '../Tooltip/Tooltip';

export interface ISegmentProps {
  data: TDataPoint;
  totalTimeMs: number;
  colors: TColorsOption;
  scale: number;
}

export interface IHoverPosition {
  x: number;
  y: number;
}

export const Segment: Component<ISegmentProps> = (props) => {
  let segmentRef: HTMLDivElement | undefined;
  let tooltipRef: HTMLDivElement | undefined;

  const [position, setPosition] = createSignal<IHoverPosition | null>(null);

  const calcPositionStyles = () => {
    const styles: JSX.CSSProperties = {};

    if (props.colors === 'time') {
      styles['background-color'] = getTimePerformanceColor(
        props.data.execTimeMs,
        props.totalTimeMs
      );
    }

    if (props.colors === 'type') {
      styles['background-color'] = getMapColor(props.data.parentType);
    }

    styles['width'] = `${
      (props.data.execTimeMs / props.totalTimeMs) * 100 * props.scale
    }%`;

    styles['margin-left'] = `${
      (props.data.execStartTimeMs / props.totalTimeMs) * 100 * props.scale
    }%`;

    return styles;
  };

  const onMouseMove = (e: MouseEvent) => {
    const segment = segmentRef?.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const tooltipWidth = tooltipRef?.clientWidth || 0;

    const { left, top } = segment || { left: 0, top: 0 };

    const x = e.clientX - left;
    const y = e.clientY - top;
    const endPosition = e.pageX + tooltipWidth;

    if (endPosition > windowWidth) {
      setPosition({ x: x - tooltipWidth - 5, y });
    } else {
      setPosition({ x, y });
    }
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={() => setPosition(null)}
      style={calcPositionStyles()}
      ref={segmentRef}
      class={cx(styles.segment, { [styles.hover]: position() })}>
      <pre class={styles.label}>{props.data.parentType}</pre>
      <Tooltip
        ref={tooltipRef}
        data={props.data}
        opacity={position() ? '1' : '0'}
        x={position()?.x}
        y={position()?.y}
      />
    </div>
  );
};
