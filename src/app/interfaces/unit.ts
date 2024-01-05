import {UnitPlayer} from "./unit-player";
import {Comment} from "./comment";

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
}
