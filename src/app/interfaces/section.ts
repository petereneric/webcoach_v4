import {Unit} from "./unit";

export interface Section {
  id: number
  kWebinar: number
  cName: string
  cDescription: string
  nPosition: number
  lUnits: Unit[]
  bEdit: boolean
  bExpand: boolean
}
