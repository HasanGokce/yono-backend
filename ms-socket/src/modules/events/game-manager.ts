import { Injectable } from "@nestjs/common";
import { Game } from "../../models/game";
import { Player } from "../../models/player";
import { Question } from "../../models/question";
import { PlayerRole } from "src/enums/player-role";
import { CmsService } from "../cms/cms.service";
import { User } from "src/models/user";
import { Pool } from "src/models/pool";

interface GameCreationResponse {
  gameToken: string;
  gamePin: string;
  userToken: string;
}

// const questions = [
//     new Question(0, "Have you ever sailed on a boat?"),
//     new Question(1, "Have you ever been to Paris?"),
//     new Question(2, "Have you ever song in the shower like a rockstar?"),
//     new Question(3, "What is the capital of Italy?"),
//     new Question(4, "What is the capital of Spain?"),
//     new Question(5, "What is the capital of Portugal?")
// ];

@Injectable()
export class GameManager {
  games: Map<string, Game>; // Oyunları depolamak için bir harita kullanılabilir
  pool: Pool; // Oyuncuları depolamak için bir havuz kullanılabilir

  constructor(private readonly cmsService: CmsService) {
    this.games = new Map();
    this.pool = Pool.getInstance();
  }

  async createGame(
    gameId: string,
    nickname: string
  ): Promise<GameCreationResponse> {
    const gameToken = this.generateGameToken();
    const gamePin = this.generateGamePin();
    const userToken = this.generateGameToken();

    const questions = await this.cmsService.getGameQuestions(gameId);

    const questionsFactory: Question[] = questions.map((question, index) => {
      return new Question(index, question.text);
    });

    const game = new Game(
      gameToken,
      questionsFactory,
      new Player(Date.now(), userToken, PlayerRole.INITIATOR, nickname)
    );
    this.games.set(gamePin, game);

    return {
      gameToken: gameToken,
      gamePin: gamePin,
      userToken: userToken,
    };
  }

  async createBlindGame(): Promise<GameCreationResponse> {
    const gameToken = this.generateGameToken();
    const gamePin = this.generateGamePin();

    const questions = await this.cmsService.getGameQuestions("14");

    const questionsFactory: Question[] = questions.map((question, index) => {
      return new Question(index, question.text);
    });

    const game = new Game(gameToken, questionsFactory);
    this.games.set(gamePin, game);

    return {
      gameToken: gameToken,
      gamePin: gamePin,
      userToken: "noneedforiusertoken",
    };
  }

  joinGame(gameToken: string, player: Player) {
    const game = this.games.get(gameToken);
    const isExist = game?.players.find((p) => p.userToken === player.userToken);
    if (game && isExist) {
      return true;
    }
    if (game) {
      game.addPlayer(player);
      return true;
    }

    return false;
  }

  createNewParticipant(nickname) {
    return new Player(
      Date.now(),
      this.generateGameToken(),
      PlayerRole.PARTICIPANT,
      nickname
    );
  }

  private generateGameToken(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateGamePin(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async addUserToPool(user: User): Promise<User[]> {
    const result = await this.pool.addUser(user);
    console.log(result);
    console.log(this.pool);
    return result;
  }

  removeUserFromPool(user: User) {
    this.pool.removeUser(user);
  }
}
