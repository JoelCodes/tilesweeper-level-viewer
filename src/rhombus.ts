import { makeLevel, setNeighbors } from "./grid-helpers";
import { SweeperLevel, TileDef } from "./types";

export function rhombusNeighbors(_tileA: TileDef, _tileB: TileDef):boolean{
  if(_tileA.type !== 'rhombus' || _tileB.type !== 'rhombus') return false;
  if(_tileA.rotation === _tileB.rotation) return false;
  return Math.abs(_tileA.cx - _tileB.cx) <= 1.5 && Math.abs(_tileA.cy - _tileB.cy) <= 1;
}

const baseRhombusLevel = {
  xDim: 50,
  yDim: 86.602,
}

const star:TileDef[] = [
  {cx: 0, cy: 1, rotation: 0, type: 'rhombus'},
  {cx: 0, cy: -1, rotation: 0, type: 'rhombus'},
  {cx: 1.5, cy: .5, rotation: -60, type: 'rhombus'},
  {cx: -1.5, cy: -.5, rotation: -60, type: 'rhombus'},
  {cx: 1.5, cy: -.5, rotation: 60, type: 'rhombus'},
  {cx: -1.5, cy: .5, rotation: 60, type: 'rhombus'},
];

const hexagon:TileDef[] = [
  ...star,
  {cx: 3, cy: 0, rotation: 0, type: 'rhombus'},
  {cx: -3, cy: 0, rotation: 0, type: 'rhombus'},
  {cx: 1.5, cy: 1.5, rotation: 60, type: 'rhombus'},
  {cx: -1.5, cy: -1.5, rotation: 60, type: 'rhombus'},
  {cx: 1.5, cy: -1.5, rotation: -60, type: 'rhombus'},
  {cx: -1.5, cy: 1.5, rotation: -60, type: 'rhombus'},
];

const bigFlower:TileDef[] = [
  ...hexagon.map(tile => ({...tile, cy: tile.cy + 2})),
  ...hexagon.map(tile => ({...tile, cy: tile.cy - 2})),
  ...hexagon.map(tile => ({...tile, cx: tile.cx + 3, cy: tile.cy + 1})),
  ...hexagon.map(tile => ({...tile, cx: tile.cx - 3, cy: tile.cy - 1})),
  ...hexagon.map(tile => ({...tile, cx: tile.cx + 3, cy: tile.cy - 1})),
  ...hexagon.map(tile => ({...tile, cx: tile.cx - 3, cy: tile.cy + 1})),
]

const flowerOfFlowers:TileDef[] = [
  ...bigFlower.map(tile => ({...tile, cy: tile.cy + 2})),
  ...bigFlower.map(tile => ({...tile, cy: tile.cy - 2})),
  ...bigFlower.map(tile => ({...tile, cx: tile.cx + 3, cy: tile.cy + 1})),
  ...bigFlower.map(tile => ({...tile, cx: tile.cx - 3, cy: tile.cy - 1})),
  ...bigFlower.map(tile => ({...tile, cx: tile.cx + 3, cy: tile.cy - 1})),
  ...bigFlower.map(tile => ({...tile, cx: tile.cx - 3, cy: tile.cy + 1})),
]

function maxDimReducer({maxX, maxY, minX, minY}: {maxX: number, maxY: number, minX: number, minY: number}, tile: TileDef){  
  if(tile.rotation === 0){
    return { 
      maxX: Math.max(maxX, tile.cx + 1),
      maxY: Math.max(maxY, tile.cy + 1),
      minX: Math.min(minX, tile.cx - 1),
      minY: Math.min(minY, tile.cy - 1),
    }
  }
  return {
    maxX: Math.max(maxX, tile.cx + 1.5),
    maxY: Math.max(maxY, tile.cy + .5),
    minX: Math.min(minX, tile.cx - 1.5),
    minY: Math.min(minY, tile.cy - .5),
  }
}

const rhombus1Tiles:TileDef[] = [
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy + 4, cx: tile.cx - 3})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy + 4, cx: tile.cx + 3})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy - 4, cx: tile.cx - 3})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy - 4, cx: tile.cx + 3})),
]

export const rhombus1:SweeperLevel = makeLevel(rhombus1Tiles, {
  name: 'Rhombus1',
  mines: 20,
  ...baseRhombusLevel
}, maxDimReducer, rhombusNeighbors);

const rhombus2Tiles:TileDef[] = [
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy + 4, cx: tile.cx - 6})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy + 4, cx: tile.cx + 6})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy - 4, cx: tile.cx - 6})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy - 4, cx: tile.cx + 6})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy + 10})),
  ...flowerOfFlowers.map(tile => ({...tile, cy: tile.cy - 10})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx + 12})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx - 12})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx + 12, cy: tile.cy + 12})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx - 12, cy: tile.cy + 12})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx + 12, cy: tile.cy - 12})),
  ...flowerOfFlowers.map(tile => ({...tile, cx: tile.cx - 12, cy: tile.cy - 12})),
]

export const rhombus2:SweeperLevel = makeLevel(rhombus2Tiles, {
  name: 'Rhombus2',
  mines: 40,
  ...baseRhombusLevel
}, maxDimReducer, rhombusNeighbors);

console.log(rhombus2)
