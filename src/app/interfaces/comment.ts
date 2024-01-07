import {CommentAnswer} from "./comment-answer";

export interface Comment {
  id: number
  dtCreation: string
  kWebinar: number
  kUnit: number
  cText: string
  bEdit: number
  nAnswers: number
  nLikes: number
  cPlayer: string
  kPlayer: number
  bLike: boolean // like made by player
  lCommentAnswers: CommentAnswer[]
  cPlayerRegard: string

}
