import {Player} from "./player";

export interface Coach {
  id: number
  cName: string
  cPrename: string | null
  cSurname: string | null
  oPlayer: Player
  htmlDescription: string
  base64Thumbnail: string | null
}
