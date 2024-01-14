import {UnitPlayer} from "./unit-player";
import {Comment} from "./comment";
import {Interval} from "./interval";

export interface Unit {
  id: number
  dCreation: string
  kSection: number
  cName: string
  cDescription: string | null
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
  lProgressThumbnails: string[]
  nComments: number
  nLikes: number
  nCalls: number
}
