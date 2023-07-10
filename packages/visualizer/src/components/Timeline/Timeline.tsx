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

    const scrollLeft = props.containerRef.scrollLeft;
    const scrollWidth = props.containerRef.scrollWidth;

    const widthToUse =
      scrollWidth <= screenWidth ? scrollWidth * props.scale : scrollWidth;

    const ms = Math.round(((x + scrollLeft) * props.totalTimeMs) / widthToUse);
    timeCursorLabelRef.innerHTML = `${ms}ms`;

    const timeCursorOffset = `calc(-${timeCursorLabelRef.clientWidth}px - 10px)`;

    if (
      x > screenWidth / 2 &&
      timeCursorLabelRef.style.left !== timeCursorOffset
    ) {
      timeCursorLabelRef.style.left = timeCursorOffset;
    } else if (x < screenWidth / 2 && timeCursorLabelRef.style.left !== '0') {
      timeCursorLabelRef.style.left = '0';
    }
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
            left: `${timeCursor()}px`,
          }}>
          <span ref={timeCursorLabelRef} class={styles.label} />
        </div>
      </div>
    </>
  );
};
