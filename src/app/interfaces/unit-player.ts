import {Note} from "./note";

export interface UnitPlayer {
  id: number | null
  kUnit: number | null
  kPlayer: number | null
  tStatus: number
  secVideo: number | null
  lNotes: Note[] | null
  bLike: boolean
  nNotes: number
}
