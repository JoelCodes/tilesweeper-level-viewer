import { LevelTile, SweeperLevel, TileDef } from "./types";

export function getId(i: number) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  let num = i;
  while (num > 0) {
    const remainder = (num - 1) % alphabet.length;
    id = alphabet[remainder] + id;
    num = Math.floor((num - 1) / alphabet.length);
  }
  return id;
}

export function setNeighbors(tiles: TileDef[], areNeighbors: (a: TileDef, b: TileDef) => boolean) {
  const uniqTiles:LevelTile[] = [];
  let index = 1;
  for (const tile of tiles) {
    if (!uniqTiles.some((t) => t.cx === tile.cx && t.cy === tile.cy && t.type === tile.type)) {
      uniqTiles.push({...tile, id: getId(index++), neighbors: []});
    }
  }
  uniqTiles.forEach((tileA) => {
    tileA.neighbors = uniqTiles.filter((tileB) => tileA.id !== tileB.id && areNeighbors(tileA, tileB)).map(tile => tile.id);
  });
  
  return Object.fromEntries(uniqTiles.map(tile => [tile.id, tile]));
}

export type Reducer<A, B> = (acc: A, tile: B) => A;
export function makeLevel(
  tiles: TileDef[], 
  rest: Pick<SweeperLevel, 'name' | 'mines'|'xDim' | 'yDim'>, 
  reducer:Reducer<Record<`m${'ax'|'in'}${'X'|'Y'}`, number>, TileDef>,
  areNeighbors: (a: TileDef, b: TileDef) => boolean
) : SweeperLevel{
  const {maxX, maxY, minX, minY} = tiles.reduce(reducer, {maxX: -Infinity, maxY: -Infinity, minX: Infinity, minY: Infinity});
  const width = (Math.abs(maxX - minX) + 2);
  const height = (Math.abs(maxY - minY) + 2);
  
  return {
    ...rest,
    width,
    height,
    tiles: setNeighbors(tiles, areNeighbors),
  }
}

export function translate({x = 0, y = 0}:{x?:number, y?:number}){
  return function(tileDef:TileDef){
    return {
      ...tileDef,
      cx: tileDef.cx + x,
      cy: tileDef.cy + y,
    }
  }
}