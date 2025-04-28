import { makeLevel, translate } from "./grid-helpers";
import { LevelTile, SweeperLevel, TileDef } from "./types";

export function dpadNeighbors(_tileA: TileDef, _tileB: TileDef):boolean{
  if(_tileA.type !== 'dpad' || _tileB.type !== 'dpad') return false;
  if(_tileA.rotation === _tileB.rotation) return false;
  return Math.abs(_tileA.cx - _tileB.cx) <= 2.75 && Math.abs(_tileA.cy - _tileB.cy) <= 2.75;
}

function maxDimReducer(_acc: {maxX: number, maxY: number, minX: number, minY: number}, tile: TileDef){  
  console.log(_acc, tile);
  if(tile.rotation === 0 || tile.rotation === 180){
    return {
      maxX: Math.max(_acc.maxX, tile.cx + 1),
      maxY: Math.max(_acc.maxY, tile.cy + 1.5),
      minX: Math.min(_acc.minX, tile.cx - 1),
      minY: Math.min(_acc.minY, tile.cy - 1.5),
    }
  }
  return { 
    maxX: Math.max(_acc.maxX, tile.cx + 1.5),
    maxY: Math.max(_acc.maxY, tile.cy + 1),
    minX: Math.min(_acc.minX, tile.cx - 1.5),
    minY: Math.min(_acc.minY, tile.cy - 1),
  }
}

const cross:TileDef[] = [
  {cx: 0, cy: 1.5, rotation: 0, type: 'dpad'},
  {cx: 0, cy: -1.5, rotation: 180, type: 'dpad'},
  {cx: 1.5, cy: 0, rotation: 270, type: 'dpad'},
  {cx: -1.5, cy: 0, rotation: 90, type: 'dpad'},
]

const bigSquare:TileDef[] = [
  ...cross,
  ...[
    {x:2, y:4},
    {x:2, y:-6},
    {x:-2, y: -4},
    {x:-2, y: 6},
    {x:-6, y:-2},
    {x:4, y:-2},
    {x:-4, y:2},
    {x:6, y:2},
  ].flatMap((coord) => cross.map(translate(coord))),
];

const level1:TileDef[] = [
  ...bigSquare,
  ...[
    // {y: -20},
    // {y: 20},
    {y: -10},
    {y: 10},
    {x: 10},
    {x: -10},
    {x: 10, y: 10},
    {x: -10, y: -10},
    {x: 10, y: -10},
    {x: -10, y: 10},
  ].flatMap((coord) => bigSquare.map(translate(coord))),
];

export const dpad1:SweeperLevel = makeLevel(level1, {
  name: 'Dpad 1',
  mines: 20,
  xDim: 50,
  yDim: 50,
}, maxDimReducer, dpadNeighbors);