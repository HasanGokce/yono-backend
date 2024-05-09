import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

import { GameManager } from './game-manager';
import { Player } from '../../models/player';
import { GameState } from 'src/enums/game-state';
import { ScreenState } from 'src/enums/screen-state';
import { AnswerState } from 'src/enums/answer-state';
import { PlayerRole } from 'src/enums/player-role';
import {areValuesSame} from 'src/utils/are-values-same';
import { Injectable } from '@nestjs/common';
import { CmsService } from '../cms/cms.service';
import { GameUtils } from 'src/utils/game-utils';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/mvp/socket',
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

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { gamePin: string; gameToken: string, userToken: string, nickname: string }, @ConnectedSocket() client: Socket): void {
    console.log("@joinRoom")
    const { gamePin, gameToken, userToken, nickname = "nickname" } = data;

    handleJoinRoom(client, gamePin)

    const currentGame = this.gameManager.games.get(gamePin);

    if(currentGame) {
      const playerRecord = currentGame.players.find(p => p.userToken === userToken);

      let role = PlayerRole.PARTICIPANT
      if(playerRecord && playerRecord.role === PlayerRole.INITIATOR) {
        role = PlayerRole.INITIATOR
        currentGame.sharedState.screenState = ScreenState.QUESTION
      } 
  
      // For game state management, join the game
      const player = new Player(Date.now(), userToken, role , nickname);
      this.gameManager.joinGame(gameToken, player);
      this.server.in(gamePin).emit('gameState', { ...currentGame.sharedState, sharedPlayers: currentGame.sharedPlayers });
      client.emit("gameState", {...currentGame.sharedState, sharedPlayers: currentGame.sharedPlayers})

    } else {
      console.log("@joinRoom Game not found")
    }
    

  }

  @SubscribeMessage('applyRoom')
  handleApplyRoom(@MessageBody() data: { gamePin: string;  nickname: string }, @ConnectedSocket() client: Socket): void {
    const gamePin = data.gamePin;
    const nickname = data.nickname;
    const game = this.gameManager.games.get(gamePin);
    if(game) {
      const participant = this.gameManager.createNewParticipant(nickname);
      this.gameManager.joinGame(gamePin, participant);
      client.emit("entranceInfo", {gamePin: gamePin, gameToken: game.gameToken, userToken: participant.userToken})
      game.gameState = GameState.PLAYING;
      this.server.in(gamePin).emit('gameState', { ...game.sharedState, sharedPlayers: game.sharedPlayers });
    } else {
      console.log("Game not found")
    }
  }


  @SubscribeMessage('createGame')
  async handleCreateGame(@MessageBody() data, @ConnectedSocket() client: Socket): Promise<void> {
    const gameId = data.gameId;
    const gameCreationResponse = this.gameManager.createGame(gameId);
    const { gameToken, gamePin, userToken } = await gameCreationResponse;
    client.emit("gameCreated",{gamePin: gamePin, gameToken: gameToken, userToken})
    client.join(gamePin)
  }

  @SubscribeMessage('questionAnswered')
  handleQuestionAnswered(@MessageBody() data : any, @ConnectedSocket() client: Socket): void {
    const { gamePin, userToken, answer } = data;
    const game = this.gameManager.games.get(gamePin);
    if(game) {
      const currentQuestion = game.sharedState.questionNumber;
      game.setAnswer(currentQuestion, userToken, answer);
      const sharedPlayers = game.sharedPlayers;
      this.server.in(gamePin).emit('gameState', { ...game.sharedState, sharedPlayers });
    } else {
      console.log("Game not found")
    }

    if(game.sharedPlayers.every(p => p.state === AnswerState.ANSWERED)) {

      // Check answers are the same
      const currentQuestion = game.sharedState.questionNumber;
      const answers = game.answers.get(currentQuestion);
      const areAnswersSame = areValuesSame(answers);
      console.log(answers)
      console.log(areAnswersSame)
      if(areAnswersSame) {
        game.sharedState.screenState = ScreenState.MATCHED;
      } else {
        game.sharedState.screenState = ScreenState.UNMATCHED;
      }      
      this.server.in(gamePin).emit('gameState', { ...game.sharedState, sharedPlayers: game.sharedPlayers });      
    }
  }

  @SubscribeMessage('nextQuestion')
  handleNextQuestion(@MessageBody() data : any, @ConnectedSocket() client: Socket): void {
    const { gamePin } = data;
    const game = this.gameManager.games.get(gamePin);

    const questionsEnded = game.sharedState.questionNumber === game.questions.length - 1;

    if(questionsEnded) {
      game.sharedState.screenState = ScreenState.FINISHED;
      
      const matchRatio = GameUtils.maptoMatchRatio(game.answers)
      this.server.in(gamePin).emit('gameState', { ...game.sharedState, sharedPlayers: game.sharedPlayers, matchRatio});
      return;
    }

    if(game) {
      game.sharedState.questionNumber++;
      game.sharedState.screenState = ScreenState.QUESTION;
      game.sharedState.questionTitle = game.questions[game.sharedState.questionNumber].text;

      console.log(game.sharedState)
      game.sharedPlayers = game.sharedPlayers.map(p => {
        return {
          userId: p.userId,
          nickname: p.nickname,
          state: AnswerState.NOT_ANSWERED
        }
      })
      this.server.in(gamePin).emit('gameState', { ...game.sharedState, sharedPlayers: game.sharedPlayers });
    }
  }
}


const handleJoinRoom = (client, roomName) => {
  console.log("@joinRoom called for " + roomName)
  client.join(roomName);
}