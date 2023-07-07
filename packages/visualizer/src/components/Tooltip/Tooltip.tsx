import { type Component } from 'solid-js';
import type { TDataPoint } from '../../types';

import styles from './Tooltip.module.css';

export interface ITooltipProps {
  data: TDataPoint;
  ref?: HTMLDivElement;
  x?: number;
  y?: number;
  opacity: string;
}

export const Tooltip: Component<ITooltipProps> = (props) => {
  return (
    <div
      ref={props.ref}
      class={styles.tooltip}
      style={{
        top: `${props.y || 0}px`,
        left: `${props.x || 0}px`,
        opacity: props.opacity,
      }}>
      <code class={styles.data}>
        {Object.entries(props.data).map(([key, value]) => (
          <div class={styles.tooltipLine}>
            <span class={styles.tooltipKey}>{key}:</span> <span>{value}</span>
          </div>
        ))}
      </code>
    </div>
  );
};
