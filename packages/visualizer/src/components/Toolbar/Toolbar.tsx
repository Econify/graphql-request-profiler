import { type Component, type Setter, type Ref, onMount } from 'solid-js';

import styles from './Toolbar.module.css';
import { TColorsOption, TSortOption } from '../../types';
import { toPercentage } from '../../util/percentage';
import { AboutDialog } from '../AboutDialog/AboutDialog';

export interface IToolbarProps {
  setFilter: Setter<string>;
  setSort: Setter<TSortOption>;
  setColors: Setter<TColorsOption>;
  setScale: Setter<number>;
  scale: number;
}

const Toolbar: Component<IToolbarProps> = (props) => {
  let filterRef: HTMLInputElement | undefined;
  let sortRef: HTMLSelectElement | undefined;
  let typeColorRef: HTMLInputElement | undefined;
  let timeColorRef: HTMLInputElement | undefined;
  let scaleRef: HTMLInputElement | undefined;
  let dialogRef: HTMLDialogElement | undefined;

  function onSortChange(e: Event & { target: HTMLSelectElement }) {
    props.setSort(
      e.target.options[e.target.options.selectedIndex].id as TSortOption
    );
  }

  function onFilterChange(e: Event & { target: HTMLInputElement }) {
    props.setFilter(e.target.value);
  }

  function onColorChange(e: Event & { target: HTMLInputElement }) {
    if (e.target.checked) {
      switch (e.target.id) {
        case 'time':
          props.setColors('time');
          if (typeColorRef) typeColorRef.checked = false;
          break;
        default:
        case 'type':
          props.setColors('type');
          if (timeColorRef) timeColorRef.checked = false;
      }
    } else {
      props.setColors('none');
    }
  }

  function onScaleChange(e: Event & { target: HTMLInputElement }) {
    props.setScale(Number(e.target.value) / 100);
  }

  function toggleModal() {
    dialogRef?.showModal();
  }

  function reset() {
    props.setFilter('');
    props.setSort('time');
    props.setColors('time');
    props.setScale(1);

    if (filterRef) filterRef.value = '';
    if (sortRef) sortRef.selectedIndex = 0;
    if (timeColorRef) timeColorRef.checked = true;
    if (typeColorRef) typeColorRef.checked = false;
    if (scaleRef) scaleRef.value = '100';
  }

  return (
    <nav class={styles.container}>
      <div class={styles.group}>
        <span>Filter</span>
        <input ref={filterRef} type='text' onInput={onFilterChange}></input>
      </div>
      <div class={styles.group}>
        <span>Sort by</span>
        <select name='sort' ref={sortRef} onChange={onSortChange}>
          <option id='time'>Execution Start (ms)</option>
          <option id='asc'>Execution Total Acsending (ms)</option>
          <option id='desc'>Exeuction Total Decsending (ms)</option>
        </select>
      </div>
      <div class={styles.group}>
        <span>Colors</span>
        <div class={styles.column}>
          <span>
            performance
            <input
              checked={true}
              type='checkbox'
              ref={timeColorRef}
              id='time'
              onChange={onColorChange}
            />
          </span>
          <span>
            type
            <input
              checked={false}
              type='checkbox'
              ref={typeColorRef}
              id='type'
              onChange={onColorChange}
            />
          </span>
        </div>
      </div>

      <div class={styles.group}>
        <span>Scale</span>
        <input
          onInput={onScaleChange}
          type='range'
          min='0'
          max='500'
          value='50'
          class={styles.slider}
          ref={scaleRef}
        />
        <span>({toPercentage(props.scale)}%)</span>
      </div>

      <button onClick={reset}>Reset</button>
      <button onClick={toggleModal}>About</button>

      <AboutDialog ref={dialogRef} />
    </nav>
  );
};

export default Toolbar;
