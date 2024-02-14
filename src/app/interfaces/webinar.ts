import {Level} from "./level";
import {Coach} from "./coach";
import {Section} from "./section";

export interface Webinar {
  id: number,
  dtCreation: string
  dtLastUpdate: string
  oCoach: Coach
  oLevel: Level
  cName: string,
  cDescriptionShort: string,
  cDescriptionLong: string,
  cStudyContent: string,
  cRequirements: string,
  cTargetGroup: string,
  cLive: string,
  lSections: Section[],
  sNet: number
  bVertical: boolean
  nComments: number
  nLikes: number
  nCalls: number
  pCompleted: number
  base64Cover: string
  base64Thumbnail: string
}
