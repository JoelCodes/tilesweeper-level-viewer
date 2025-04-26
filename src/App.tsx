import { createEffect, createReaction, createSignal, For, on, Show } from 'solid-js';
import { SweeperLevel } from './types';
import { rhombus1, rhombus2 } from './rhombus';
import classNames from 'classnames';

const levels:SweeperLevel[] = [rhombus1, rhombus2];

const rhombusPoints = [-50, 0, 0, 86.602, 50, 0, 0, -86.602].join(' ');
const dpadPoints = [-50, -25, -50, 75, 50, 75, 50, -25, 0, -75].join(' ');

export default function App(){
  const [active, setActive] = createSignal<SweeperLevel>(levels[0]);

  return <div>
    <h1 class='text-3xl font-bold text-center py-4'>Sweeper Levels</h1>
    <div class='grid grid-cols-4 gap-4'>
      <For each={levels}>
        {(level) => {
          const {name, tiles, xDim, yDim, mines} = level
          return (
          <div on:click={() => setActive(level)} class={classNames("border-2 rounded-lg p-4", {
            'border-blue-500': active()?.name === name,
            'border-gray-300': active()?.name !== name,
          })}>
          <h2 class='text-2xl font-semibold text-center'>{name} ({mines} / {Object.keys(level.tiles).length})</h2>
          <svg viewBox="-200 -200 400 400" class='w-full'>
            <For each={Object.values(tiles)}>
              {({cx, cy, rotation, type}) => {
                const points = type === 'rhombus' ? rhombusPoints : dpadPoints
                return <g style={{transform: `translate(${cx * xDim}px, ${cy * yDim}px) rotate(${rotation}deg) `}}>
                  <polygon points={points} fill='blue' stroke='black' stroke-width='2'/>
                </g>
              }}
            </For>
          </svg>
        </div>
        )}}
      </For>
    </div>
    <Show when={active()}>
      <div class='flex justify-center'>
        <ActiveLevel level={active()!}/>
      </div>
    </Show>
          
  </div>
}

function ActiveLevel(props:{level:SweeperLevel}){
  const [activeTiles, setActiveTiles] = createSignal<string[]>([]);
  createEffect(on(() => props.level, () => {
    console.log('Resetting active tiles');
    setActiveTiles([]);
  }, { defer: true }));

  return <svg viewBox={`${-props.level.width / 2} ${-props.level.height / 2} ${props.level.width} ${props.level.height}`}>
    <For each={Object.values(props.level.tiles)}>
      {({ id, cx, cy, rotation, type, neighbors}) => {
        const points = type === 'rhombus' ? rhombusPoints : dpadPoints
        return <g on:click={() => setActiveTiles([id, ...neighbors])} style={{transform: `translate(${cx * props.level.xDim}px, ${cy * props.level.yDim}px) rotate(${rotation}deg) `}}>
          <polygon points={points} fill={activeTiles().includes(id) ? 'blue': '#ddd'} stroke='black' stroke-width='2'/>
        </g>
      }}
    </For>
    <circle r={10} fill='red' />
  </svg>
}