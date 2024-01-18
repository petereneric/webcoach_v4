import {Webinar} from "./webinar";
import {Coach} from "./coach";

export interface WebinarPlayer {
  id: number
  kWebinar: number
  kCurrentUnit: number
  kVideoSpeed: number
  aWebinar: Webinar
  aCoach: Coach
  pProgress: number
}
