import { createEffect, createSignal, For, on, Show } from 'solid-js';
import { SweeperLevel } from './types';
import { rhombus1, rhombus2 } from './rhombus';
import classNames from 'classnames';
import { dpad1 } from './dpad';

const levels:SweeperLevel[] = [rhombus1, rhombus2, dpad1];

const rhombusPoints = [-50, 0, 0, 86.602, 50, 0, 0, -86.602].join(' ');
const dpadPoints = [-50, -25, -50, 75, 50, 75, 50, -25, 0, -75].join(' ');

export default function App(){
  const [active, setActive] = createSignal<SweeperLevel>(dpad1);

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
                  <polygon points={points} fill='blue' stroke='black' stroke-width='10'/>
                </g>
              }}
            </For>
          </svg>
        </div>
        )}}
      </For>
    </div>
    <Show when={active()}>
      <div class='flex justify-center relative'>
        <ActiveLevel level={active()!}/>
        <div class='absolute top-0 right-0'>
          <svg viewBox='0 0 24 24' class='w-16 h-16' on:click={() => {
            const copyText = document.getElementById('copy-to-clipboard') as HTMLInputElement;
            copyText.select();
            copyText.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(copyText.value);
          }}>
            {/* svg path for a copy to clipboard icon */}
            <path d="M19 3H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V5h14v16zm-7-4h-4v-4h4v4zm0-6h-4V7h4v4z"/>
          </svg>
          <input class='hidden' type='text' id='copy-to-clipboard' value={JSON.stringify(active(), null, 2)} />
        </div>
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