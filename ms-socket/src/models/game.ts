import { GameState } from "src/enums/game-state";
import { Player } from "./player";
import { Question } from "./question";
import { ScreenState } from "src/enums/screen-state";

interface SharedState {
    questionTitle: string;
    screenState: string;
    questionNumber: number;
}

export class Game {
    gameToken: string;
    players: Player[];
    questions: Question[];
    answers: Map<number, Map<string, boolean>>; // Soru ID'si -> Kullanıcı Token'ı -> Cevap
    gameState: GameState;
    sharedState: SharedState
    sharedPlayers: { userId: number, nickname: string, state: string}[]

    constructor(gameToken: string, questions: Question[], gameCreator: Player) {
        this.gameToken = gameToken;
        this.players = [];
        this.questions = questions;
        this.answers = new Map();
        questions.forEach(question => {
            this.answers.set(question.id, new Map());
        });
        this.sharedPlayers = [];
        this.addPlayer(gameCreator);
        this.gameState = GameState.INIT;
        this.sharedState = {
            questionTitle: this.questions[0].text,
            screenState: ScreenState.WAITING,
            questionNumber: 0
        }
    }

    addPlayer(player: Player) {
        console.log(player)
        this.sharedPlayers.push({
            userId: player.id,
            nickname: player.nickname,
            state: "notAnswered"
        });
        this.players.push(player);
    }

    setAnswer(questionId: number, userToken: string, answer: boolean) {
        const userId = this.players.find(p => p.userToken === userToken)?.id;
        const questionAnswers = this.answers.get(questionId);
        if (questionAnswers) {
            questionAnswers.set(userToken, answer);
            this.sharedPlayers.find(p => p.userId === userId).state = "answered";
        } else {
            console.log("Question not found for id of " + questionId);
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