import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

import Toolbar from './components/Toolbar/Toolbar';
import { TColorsOption, TSortOption } from './types';
import Chart from './components/Chart/Chart';

// @ts-ignore
const data = window.data;

const App: Component = () => {
  const [filter, setFilter] = createSignal<string>('');
  const [sort, setSort] = createSignal<TSortOption>('time');
  const [colors, setColors] = createSignal<TColorsOption>('time');
  const [scale, setScale] = createSignal<number>(1);

  if (!data) return <div>No data found</div>;

  return (
    <>
      <Toolbar
        scale={scale()}
        setScale={setScale}
        setFilter={setFilter}
        setSort={setSort}
        setColors={setColors}
      />
      <Chart
        sort={sort()}
        scale={scale()}
        filter={filter()}
        data={data}
        colors={colors()}
      />
    </>
  );
};

export default App;
