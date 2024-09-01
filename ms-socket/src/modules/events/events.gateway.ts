import { Injectable } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { jwtDecode } from "jwt-decode";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server, Socket } from "socket.io";

import { createAnswerDto, initGameRequestDto } from "@src/domain/init";
import { AnswerState } from "@src/enums/answer-state";
import { GameState } from "@src/enums/game-state";
import { PlayerRole } from "@src/enums/player-role";
import { ScreenState } from "@src/enums/screen-state";
import { User } from "@src/models/user";
import { areValuesSame } from "@src/utils/are-values-same";
import { GameUtils } from "@src/utils/game-utils";
import { Player } from "../../models/player";
import { CmsService } from "../cms/cms.service";
import { GameManager } from "./game-manager";
import { saveMatchResult } from "@src/services/match";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  path: "/mvp/socket",
})
@Injectable()
export class EventsGateway {
  @WebSocketServer()
  server: Server;
  gameManager: GameManager;

  constructor(private readonly cmsService: CmsService) {}

  async onModuleInit() {
    await this.initializeGameManager();
  }

  private async initializeGameManager() {
    this.gameManager = new GameManager(this.cmsService);
  }

  handleConnection(client: Socket): void {}

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item }))
    );
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(
    @MessageBody()
    data: {
      gamePin: string;
      gameToken: string;
      userToken: string;
      nickname: string;
    },
    @ConnectedSocket() client: Socket
  ): void {
    const { gamePin, gameToken, userToken, nickname = "nickname" } = data;

    handleJoinRoom(client, gamePin);

    const currentGame = this.gameManager.games.get(gamePin);

    if (currentGame) {
      const playerRecord = currentGame.players.find(
        (p) => p.userToken === userToken
      );

      let role = PlayerRole.PARTICIPANT;
      if (playerRecord && playerRecord.role === PlayerRole.INITIATOR) {
        role = PlayerRole.INITIATOR;
        currentGame.sharedState.screenState = ScreenState.QUESTION;
      }

      // For game state management, join the game
      const player = new Player("id", userToken, role, nickname);
      this.gameManager.joinGame(gameToken, player);
      this.server.in(gamePin).emit("gameState", {
        ...currentGame.sharedState,
        sharedPlayers: currentGame.sharedPlayers,
      });
      client.emit("gameState", {
        ...currentGame.sharedState,
        sharedPlayers: currentGame.sharedPlayers,
      });
    } else {
    }
  }

  @SubscribeMessage("applyRoom")
  handleApplyRoom(
    @MessageBody() data: { gamePin: string; nickname: string },
    @ConnectedSocket() client: Socket
  ): void {
    const gamePin = data.gamePin;
    const nickname = data.nickname;
    const game = this.gameManager.games.get(gamePin);
    if (game) {
      const participant = this.gameManager.createNewParticipant(nickname);
      this.gameManager.joinGame(gamePin, participant);
      client.emit("entranceInfo", {
        gamePin: gamePin,
        gameToken: game.gameToken,
        userToken: participant.userToken,
      });
      game.gameState = GameState.PLAYING;
      this.server.in(gamePin).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
      });
    } else {
    }
  }

  @SubscribeMessage("createGame")
  async handleCreateGame(
    @MessageBody() data,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const gameId = data.gameId;
    const nickname = data.nickname || "creator";
    const gameCreationResponse = this.gameManager.createGame(gameId, nickname);
    const { channelId } = await gameCreationResponse;
    client.emit("gameCreated", {
      channelId,
    });
    client.join(channelId);
  }

  @SubscribeMessage("questionAnswered")
  handleQuestionAnswered(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    const createAnswerRequest: createAnswerDto = {
      userId: data.id,
      channelId: data.channelId,
      answer: data.answer,
    };

    console.log({ createAnswerRequest });

    const { userId, channelId, answer } = createAnswerRequest;

    const game = this.gameManager.games.get(channelId);

    if (game) {
      const currentQuestion = game.sharedState.questionNumber;
      game.setAnswer(currentQuestion, userId, answer);

      const sharedPlayers = game.sharedPlayers;

      const lastState = { ...game.sharedState, sharedPlayers };

      console.log({ lastState });

      this.server.in(channelId).emit("gameState", lastState);
    } else {
      throw new Error("Game not found");
    }

    if (game.sharedPlayers.every((p) => p.state === AnswerState.ANSWERED)) {
      // Check answers are the same
      const currentQuestion = game.sharedState.questionNumber;
      const answers = game.answers.get(currentQuestion);
      const areAnswersSame = areValuesSame(answers);
      if (areAnswersSame) {
        game.sharedState.screenState = ScreenState.MATCHED;
      } else {
        game.sharedState.screenState = ScreenState.UNMATCHED;
      }
      this.server.in(channelId).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
      });

      this.server.in(channelId).emit("matchResult");
    }
  }

  @SubscribeMessage("nextQuestion")
  handleNextQuestion(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    const { channelId } = data;
    const game = this.gameManager.games.get(channelId);

    const questionsEnded =
      game.sharedState.questionNumber === game.questions.length - 1;

    if (questionsEnded) {
      game.sharedState.screenState = ScreenState.FINISHED;

      const matchRatio = GameUtils.maptoMatchRatio(game.answers);
      this.server.in(channelId).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
        matchRatio,
      });

      // send result to db
      saveMatchResult({
        match_rate: Number(matchRatio),
        participants: game.sharedPlayers.map((p) => p.userId),
        topic_id: "07b1a847-ce12-4235-b49b-8cbafb6c20e3",
      });

      return;
    }

    if (game) {
      game.sharedState.questionNumber++;
      game.sharedState.screenState = ScreenState.QUESTION;
      game.sharedState.questionTitle =
        game.questions[game.sharedState.questionNumber].text;

      game.sharedPlayers = game.sharedPlayers.map((p) => {
        return {
          userId: p.userId,
          nickname: p.nickname,
          state: AnswerState.NOT_ANSWERED,
        };
      });
      this.server.in(channelId).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
      });
    }
  }

  @SubscribeMessage("joinPool")
  async handleJoinPool(
    @MessageBody() data,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const initGameRequest: initGameRequestDto = {
      id: data.id,
      gameType: data.gameType,
      name: data.username,
      code: data?.code,
    };

    if (!initGameRequest?.code && initGameRequest?.gameType === "blind") {
      const user = new User(
        initGameRequest.id,
        initGameRequest.name,
        client.id
      );

      // Check if user already in pool otherwise add to pool
      const userInPool = this.gameManager.pool.users.get(user.id);
      if (userInPool) return;
      const users = await this.gameManager.addUserToPool(user);

      console.log(users);

      if (users.length > 1) {
        const { channelId } = await this.gameManager.createBlindGame();

        const currentGame = this.gameManager.games.get(channelId);

        // Her iki oyuncuyu odaya al
        users.forEach((user) => {
          if (user.socketId) {
            console.log({ user });
            // 1. Add player to game object
            const player = new Player(
              user.id,
              user.id,
              PlayerRole.PARTICIPANT,
              user.username
            );
            currentGame.addPlayer(player);

            // 2. Add players to room
            this.server.sockets;
            this.server.sockets.socketsJoin(user.socketId);
            const firstUserSocket = this.server.sockets.sockets.get(
              user.socketId
            );

            if (firstUserSocket) {
              firstUserSocket.join(channelId);
            } else {
              console.warn("Client socket not found");
            }

            this.server.in(channelId).emit("gameCreated", {
              channelId,
            });
          } else {
            console.warn("Socket id not found");
          }
        });

        this.server.in(channelId).emit("gameState", {
          ...this.gameManager.games.get(channelId).sharedState,
          sharedPlayers: this.gameManager.games.get(channelId).sharedPlayers,
        });
      } else {
        console.info("@waiting-for-other-players");
      }
    } else if (
      // Private room create
      initGameRequest?.code &&
      initGameRequest?.gameType === "private"
    ) {
      return null;
    } else if (
      // Pricate room attend
      !initGameRequest?.code &&
      initGameRequest?.gameType === "private"
    ) {
      return null;
    } else {
      throw new Error("Invalid game type");
    }
  }

  @SubscribeMessage("leavePool")
  async handleLeavePool(
    @MessageBody() data,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    const jwt = data.jwt;

    const decoded: { id: number } = jwtDecode(jwt);

    if (decoded.id) {
      const user = new User(data.id, "cancelled");
      this.gameManager.removeUserFromPool(user);
    } else {
      console.warn("Invalid JWT");
    }
  }
}

const handleJoinRoom = (client, roomName) => {
  client.join(roomName);
};
