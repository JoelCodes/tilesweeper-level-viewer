import { makeLevel, translate } from "./grid-helpers";
import { SweeperLevel, TileDef } from "./types";

export function octostarNeighbors(a:TileDef, b:TileDef) {
  switch(a.type) {
    case 'octostar':{
      if(b.type !== 'oshouse') return false;
      if(a.rotation === 0){
        // Male Flower
        if(b.rotation % 90 !== 0) return false;
        return Math.abs(a.cx - b.cx) <= 1 && Math.abs(a.cy - b.cy) <= 1;
      } else {
        // Female Flower        
        if(b.rotation % 90 === 0) return false;
        return Math.abs(a.cx - b.cx) <= 1 && Math.abs(a.cy - b.cy) <= 1;
      }
    }
    case 'ossquare':{
      if(b.type !== 'oshouse') return false;
      return Math.abs(a.cx - b.cx) <= .5 && Math.abs(a.cy - b.cy) <= .5;
    }
    case 'oshouse':{
      if(b.type === 'oshouse') return Math.abs(a.cx - b.cx) <= .5 && Math.abs(a.cy - b.cy) <= .5;
      return octostarNeighbors(b, a);
    }

    default: return false;
  }
}

const baseOctostarLevel = {
  xDim: 100,
  yDim: 100
}

const maleFlower:TileDef[] = [
  {cx: 0, cy: 0, rotation: 0, type: 'octostar'},
  {cx: .5, cy: .5, rotation: 0, type: 'oshouse'},
  {cx: -.5, cy: .5, rotation: 90, type: 'oshouse'},
  {cx: -.5, cy: -.5, rotation: 180, type: 'oshouse'},
  {cx: .5, cy: -.5, rotation: 270, type: 'oshouse'},
  {cx: 0, cy: Math.SQRT1_2, rotation: 0, type: 'ossquare'},
  {cx: 0, cy: -Math.SQRT1_2, rotation: 0, type: 'ossquare'},
  {cx: Math.SQRT1_2, cy: 0, rotation: 0, type: 'ossquare'},
  {cx: -Math.SQRT1_2, cy: 0, rotation: 0, type: 'ossquare'},
];

const femaleFlower:TileDef[] = [
  {cx: 0, cy: 0, rotation: 180, type: 'octostar'},
  {cx: 0, cy: Math.SQRT1_2, rotation: 45, type: 'oshouse'},
  {cx: -Math.SQRT1_2, cy: 0, rotation: 135, type: 'oshouse'},
  {cx: 0, cy: -Math.SQRT1_2, rotation: 225, type: 'oshouse'},
  {cx: Math.SQRT1_2, cy: 0, rotation: 315, type: 'oshouse'},
]

const level1:TileDef[] = [
  ...maleFlower,
  ...[{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}].flatMap((coord) => femaleFlower.map(translate(coord))),
  ...[-2, 0, 2].flatMap((x) => [-2, 0, 2].flatMap((y) => maleFlower.map(translate({x, y})))),
]
export const octostar1:SweeperLevel = makeLevel(level1, {
  name: 'Octostar 1',
  mines: 10,
  ...baseOctostarLevel
}, () => ({ minX: -2, minY: -2, maxX: 2, maxY: 2 }), octostarNeighbors);