export interface initGameRequestDto {
  id: string;
  name: string;
  gameType: "blind" | "private";
  topicId?: string;
  code?: string;
}

export interface createAnswerDto {
  userId: string;
  channelId: string;
  answer: string;
}
