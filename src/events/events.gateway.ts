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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(@MessageBody() data: { channel: string }, @ConnectedSocket() client: Socket): void {
    const { channel } = data;
    client.join(channel);
    // Optionally send a message to the channel or perform other actions
    this.server.to(channel).emit('joinedChannel', `User joined channel: ${channel}`);
  }
  
  @SubscribeMessage('joinGame')
  handleJoinGame(@MessageBody() data: { gameCode: string }, @ConnectedSocket() client: Socket): void {
    const { gameCode } = data;
    client.join(gameCode);
    // Optionally send a message to the channel or perform other actions
    this.server.to(gameCode).emit('gameStarted', `Hiç uzaylılarla iletişim kurdun mu?`);
  }

  @SubscribeMessage('createGame')
  handleCreateGame(@MessageBody() data, @ConnectedSocket() client: Socket): void {
    console.log(data)
    const gameCode = "123456"
    client.emit("gameCreated",{gameCode: gameCode, roundId: "ae34edde324d23d425s22a"})
    client.join(gameCode)
    // Optionally send a message to the channel or perform other actions
  }
}
