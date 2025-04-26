import { LevelTile, TileDef } from "./types";

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