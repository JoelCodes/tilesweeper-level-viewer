export type TileType = 'rhombus' | 'octostar' | 'ossquare' | 'oshouse' 

export type TileDef = {
  cx: number;
  cy: number;
  rotation: number;
  type: TileType;
}

export type LevelTile = TileDef & {
  id: string;
  neighbors: string[];
}

export type SweeperLevel = {
  name: string;
  mines: number;
  xDim: number;
  yDim: number;
  tiles: Record<string, LevelTile>;
  width: number;
  height: number;
}