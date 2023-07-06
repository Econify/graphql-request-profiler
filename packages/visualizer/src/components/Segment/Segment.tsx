import { createSignal, type Component, type JSX } from 'solid-js';
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
  let hoverRef: HTMLDivElement | undefined;
  const [hover, setHover] = createSignal<IHoverPosition | null>(null);

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

    styles['width'] = `calc(${
      (props.data.execTimeMs / props.totalTimeMs) * 100 * props.scale
    }% - 4px)`;

    styles['margin-left'] = `${
      (props.data.execStartTimeMs / props.totalTimeMs) * 100 * props.scale
    }%`;

    return styles;
  };

  const onMouseMove = (e: MouseEvent) => {
    const rect = hoverRef?.getBoundingClientRect();
    const { left, top } = rect || { left: 0, top: 0 };

    const x = e.clientX - left;
    const y = e.clientY - top;

    setHover({ x, y });
  };

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={() => setHover(null)}
      style={calcPositionStyles()}
      ref={hoverRef}
      class={cx(styles.segment, { [styles.hover]: hover() })}>
      <pre class={styles.label}>{props.data.parentType}</pre>
      {hover() && <Tooltip data={props.data} x={hover()?.x} y={hover()?.y} />}
    </div>
  );
};
