import { GameState } from "@src/common/enums/game-state";
import { Player } from "./player";
import { Question } from "./question";
import { ScreenState } from "@src/common/enums/screen-state";

interface SharedState {
  questionTitle: string;
  screenState: string;
  questionNumber: number;
}

export class Game {
  gameToken: string;
  players: Player[];
  questions: Question[];
  answers: Map<number, Map<string, string>>; // Soru ID'si -> Kullanıcı Token'ı -> Cevap
  gameState: GameState;
  sharedState: SharedState;
  sharedPlayers: { userId: string; nickname: string; state: string }[];

  constructor(gameToken: string, questions: Question[], gameCreator?: Player) {
    this.gameToken = gameToken;
    this.players = [];
    this.questions = questions;
    this.answers = new Map();
    questions.forEach((question) => {
      this.answers.set(question.id, new Map());
    });
    this.sharedPlayers = [];

    if (gameCreator) this.addPlayer(gameCreator);

    this.gameState = GameState.INIT;
    this.sharedState = {
      questionTitle: this.questions[0].text,
      screenState: ScreenState.WAITING,
      questionNumber: 0,
    };
  }

  addPlayer(player: Player) {
    this.sharedPlayers.push({
      userId: player.id,
      nickname: player.nickname,
      state: "notAnswered",
    });
    this.players.push(player);
  }

  setAnswer(questionId: number, userToken: string, answer: string) {
    const userId = this.players.find((p) => p.userToken === userToken)?.id;
    const questionAnswers = this.answers.get(questionId);
    if (questionAnswers) {
      questionAnswers.set(userToken, answer);
      this.sharedPlayers.find((p) => p.userId === userId).state = "answered";
    } else {
      throw new Error("Question not found");
    }
  }

  getSharedAnswerState() {
    const questionAnswers = this.answers.get(this.sharedState.questionNumber);
    if (questionAnswers) {
      return questionAnswers;
    }
    return new Map();
  }

  // Diğer oyun yönetimi işlevleri buraya eklenebilir
}
