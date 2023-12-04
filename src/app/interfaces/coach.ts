import {Player} from "./player";

export interface Coach {
  id: number
  cName: string
  oPlayer: Player
  htmlDescription: string
}
