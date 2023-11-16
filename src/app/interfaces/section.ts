import {Unit} from "./unit";

export interface Section {
  id: number
  cName: string
  nPosition: number
  lUnits: Unit[]
  bEdit: boolean
}
