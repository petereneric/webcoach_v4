import {UnitPlayer} from "./unit-player";

export interface Unit {
  id: number
  cName: string
  secDuration: number
  oUnitPlayer: UnitPlayer | null
  imgThumbnail: string
  bMaterial: boolean
  lMaterials: any[]
  bVideo: boolean
  nPosition: number
}
