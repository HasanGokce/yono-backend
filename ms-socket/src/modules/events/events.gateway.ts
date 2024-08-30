import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server, Socket } from "socket.io";

import { GameManager } from "./game-manager";
import { Player } from "../../models/player";
import { GameState } from "src/enums/game-state";
import { ScreenState } from "src/enums/screen-state";
import { AnswerState } from "src/enums/answer-state";
import { PlayerRole } from "src/enums/player-role";
import { areValuesSame } from "src/utils/are-values-same";
import { Injectable } from "@nestjs/common";
import { CmsService } from "../cms/cms.service";
import { GameUtils } from "src/utils/game-utils";
import { jwtDecode } from "jwt-decode";
import { User } from "src/models/user";

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

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

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
    console.log("@joinRoom");
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
      const player = new Player(Date.now(), userToken, role, nickname);
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
      console.log("@joinRoom Game not found");
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
      console.log("Game not found");
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
    const { gameToken, gamePin, userToken } = await gameCreationResponse;
    client.emit("gameCreated", {
      gamePin: gamePin,
      gameToken: gameToken,
      userToken,
    });
    client.join(gamePin);
  }

  @SubscribeMessage("questionAnswered")
  handleQuestionAnswered(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    const { gamePin, gameToken, userToken, answer } = data;
    console.log(data);
    const game = this.gameManager.games.get(gamePin);
    if (game) {
      const currentQuestion = game.sharedState.questionNumber;
      console.log({ currentQuestion });
      game.setAnswer(currentQuestion, userToken, answer);
      const sharedPlayers = game.sharedPlayers;
      console.log({ sharedPlayers });
      this.server
        .in(gamePin)
        .emit("gameState", { ...game.sharedState, sharedPlayers });
    } else {
      console.log("Game not found");
      return;
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
      this.server.in(gamePin).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
      });

      this.server.in(gamePin).emit("matchResult");
    }
  }

  @SubscribeMessage("nextQuestion")
  handleNextQuestion(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket
  ): void {
    const { gamePin } = data;
    const game = this.gameManager.games.get(gamePin);

    const questionsEnded =
      game.sharedState.questionNumber === game.questions.length - 1;

    if (questionsEnded) {
      game.sharedState.screenState = ScreenState.FINISHED;

      const matchRatio = GameUtils.maptoMatchRatio(game.answers);
      this.server.in(gamePin).emit("gameState", {
        ...game.sharedState,
        sharedPlayers: game.sharedPlayers,
        matchRatio,
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
      this.server.in(gamePin).emit("gameState", {
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
    // const jwt = data.jwt;
    const username = data.username;
    const id = data.id;

    // const decoded: { id: number } = jwtDecode(jwt);

    // if (!decoded.id) return console.log("Invalid JWT");

    const user = new User(id, username, client.id);
    const users = await this.gameManager.addUserToPool(user);

    // Eşleşme sağlandığında oyun oluşturulur ve oyunun bilgileri döner
    // İki user dönerse eşleşme sağlanmış demektir

    // Tek user dönerse eşleşme sağlanmamış demektir
    if (users.length > 1) {
      const gameCreationResponse = await this.gameManager.createBlindGame();
      const { gameToken, gamePin, userToken } = gameCreationResponse;

      console.log("@gameCrated");

      const currentGame = this.gameManager.games.get(gamePin);

      // Her iki oyuncuyu odaya al
      users.forEach((user) => {
        if (user.socketId) {
          // 1. Add player to game object
          console.log({ user });
          const player = new Player(
            Date.now(),
            user.username,
            PlayerRole.PARTICIPANT,
            user.username
          );
          currentGame.addPlayer(player);

          // 2. Add players to room
          console.log("socketid: " + user.socketId);
          this.server.sockets;
          this.server.sockets.socketsJoin(user.socketId);
          const firstUserSocket = this.server.sockets.sockets.get(
            user.socketId
          );

          if (firstUserSocket) {
            console.log("sanki buraya gerek yok gibi.");
            firstUserSocket.join(gamePin);
          } else {
            console.log("Client socket not found");
          }

          this.server.in(gamePin).emit("gameCreated", {
            gamePin: gamePin,
            gameToken: gameToken,
            userToken: userToken,
          });
        } else {
          console.log("Socket id not found");
        }
      });

      console.log(currentGame.sharedPlayers);

      // Odaya katılan kullanıcıyı odaya al

      // Her iki kullanıcıyı da odaya al
      // Oyunu başlat
      // Oyunun başladığını her iki kullanıcıya bildir
      // Oyunun durumunu her iki kullanıcıya bildir

      this.server.in(gamePin).emit("gameState", {
        ...this.gameManager.games.get(gamePin).sharedState,
        sharedPlayers: this.gameManager.games.get(gamePin).sharedPlayers,
      });
    } else {
      console.log("Waiting for another player");
    }
  }

  @SubscribeMessage("leavePool")
  async handleLeavePool(
    @MessageBody() data,
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    console.log("@server leavePool");
    const jwt = data.jwt;

    const decoded: { id: number } = jwtDecode(jwt);

    if (decoded.id) {
      const user = new User(data.id, "cancelled");
      this.gameManager.removeUserFromPool(user);
    } else {
      console.log("Invalid JWT");
    }

    console.log(this.gameManager.pool.getUsers());
  }
}

const handleJoinRoom = (client, roomName) => {
  console.log("@joinRoom called for " + roomName);
  client.join(roomName);
};
