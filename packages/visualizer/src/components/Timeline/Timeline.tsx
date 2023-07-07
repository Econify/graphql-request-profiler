import { createSignal, type Component, ParentProps, onMount } from 'solid-js';

import cx from 'classnames';
import styles from './Timeline.module.css';

export type TTimelineProps = ParentProps<{
  containerRef?: HTMLDivElement;
  totalTimeMs: number;
  scale: number;
}>;

export const Timeline: Component<TTimelineProps> = (props) => {
  let timeCursorLabelRef: HTMLSpanElement | undefined;

  const [timeCursor, setTimeCursor] = createSignal<number | undefined>(
    undefined
  );

  const toggleTimeCursor = (e: MouseEvent) => {
    e.preventDefault();

    if (
      typeof props.containerRef === 'undefined' ||
      typeof timeCursorLabelRef === 'undefined'
    ) {
      return;
    }

    const rect = props.containerRef.getBoundingClientRect();
    const { width: screenWidth } = rect || { left: 0 };

    const x = e.clientX;

    setTimeCursor(x);
    // (x * props.totalTimeMs * (1 / props.scale)) / width
    const scrollLeft = props.containerRef.scrollLeft;
    const scrollWidth = props.containerRef.scrollWidth;

    const ms = Math.round(((x + scrollLeft) * props.totalTimeMs) / scrollWidth);

    if (x > screenWidth / 2 && timeCursorLabelRef.style.left !== '-170px') {
      timeCursorLabelRef.style.left = '-170px';
    } else if (x < screenWidth / 2 && timeCursorLabelRef.style.left !== '0') {
      timeCursorLabelRef.style.left = '0';
    }

    timeCursorLabelRef.innerHTML = `
    <div>${ms}ms</div>
    <div>clientX: ${e.clientX}</div>
    <div>scrollLeft: ${scrollLeft}</div>
    <div>scrollWidth: ${scrollWidth}</div>
    <div>screenWidth: ${screenWidth}</div>
    `;
  };

  onMount(() => {
    if (typeof props.containerRef === 'undefined') {
      return;
    }

    props.containerRef.addEventListener('mousemove', toggleTimeCursor);
    props.containerRef.addEventListener('mouseleave', () =>
      setTimeCursor(undefined)
    );
    props.containerRef.addEventListener('scroll', () =>
      setTimeCursor(undefined)
    );

    return () => {
      props.containerRef?.removeEventListener('mousemove', toggleTimeCursor);
      props.containerRef?.removeEventListener('mouseleave', () =>
        setTimeCursor(undefined)
      );
      props.containerRef?.removeEventListener('scroll', () =>
        setTimeCursor(undefined)
      );
    };
  });

  return (
    <>
      {props.children}
      <div class={styles.container}>
        <div
          class={styles.timeCursor}
          style={{
            display: typeof timeCursor() === 'undefined' ? 'none' : 'block',
            left: `${timeCursor()}px `,
          }}>
          <span ref={timeCursorLabelRef} class={styles.label} />
        </div>
      </div>
    </>
  );
};
