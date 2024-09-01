import { Injectable } from "@nestjs/common";
import { Game } from "../../models/game";
import { Player } from "../../models/player";
import { Question } from "../../models/question";
import { PlayerRole } from "@src/enums/player-role";
import { CmsService } from "../cms/cms.service";
import { User } from "@src/models/user";
import { Pool } from "@src/models/pool";
import { v6 as uuidv6 } from "uuid";
import { channel } from "diagnostics_channel";

interface GameCreationResponse {
  channelId: string;
}

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
      new Player(userToken, userToken, PlayerRole.INITIATOR, nickname)
    );
    this.games.set(gamePin, game);

    return {
      channelId: "notimplemented",
    };
  }

  async createBlindGame(): Promise<GameCreationResponse> {
    const channelId = this.generateChannelId();

    // get random topic
    const topic = await this.cmsService.getRandomTopic();

    const questions = await this.cmsService.getGameQuestions(topic);

    if (questions.length > 0) {
      const questionsFactory: Question[] = questions.map((question, index) => {
        return new Question(index, question.text);
      });

      const game = new Game(channelId, questionsFactory);
      this.games.set(channelId, game);

      return {
        channelId: channelId,
      };
    } else {
      console.warn("No questions found for the topic");
    }
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
      nickname,
      this.generateGameToken(),
      PlayerRole.PARTICIPANT,
      nickname
    );
  }

  private generateGameToken(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private generateChannelId(): string {
    return uuidv6();
  }

  private generateGamePin(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async addUserToPool(user: User): Promise<User[]> {
    const result = await this.pool.addUser(user);
    return result;
  }

  async getUserById(user: User): Promise<User> {
    return this.pool.getUser(user);
  }

  removeUserFromPool(user: User) {
    this.pool.removeUser(user);
  }
}
