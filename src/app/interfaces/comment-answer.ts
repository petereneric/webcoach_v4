export interface CommentAnswer extends Comment {
  id: number
  kComment: number
  kPlayer: number
  cText: string
  bLike: boolean
  nLikes: number
}
