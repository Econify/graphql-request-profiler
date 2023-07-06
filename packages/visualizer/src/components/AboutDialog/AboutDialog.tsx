import { type Component } from 'solid-js';
import styles from './AboutDialog.module.css';

export interface IAboutProps {
  ref: HTMLDialogElement | undefined;
}

export const AboutDialog: Component<IAboutProps> = (props) => {
  return (
    <dialog ref={props.ref}>
      <p class={styles.text}>
        Written by Regan Karlewicz for{' '}
        <a href="https://www.econify.com">Econify</a>
      </p>
      <form class={styles.form} method="dialog">
        <button>OK</button>
      </form>
    </dialog>
  );
};
