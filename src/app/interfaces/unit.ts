import {UnitPlayer} from "./unit-player";
import {Comment} from "./comment";
import {Interval} from "./interval";

export interface Unit {
  id: number
  kSection: number
  cName: string
  secDuration: number
  oUnitPlayer: UnitPlayer | null
  imgThumbnail: string
  bMaterial: boolean
  lMaterials: any[]
  bVideo: boolean
  nPosition: number
  bSample: number
  lComments: Comment[]
  lIntervals: Interval[]
  lProcessThumbnails: string[]
  nComments: number
  nLikes: number
}
