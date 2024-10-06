import { Injectable } from "@nestjs/common";
import { PlayerRole } from "@src/common/enums/player-role";
import { initGameRequestDto } from "@src/common/interfaces/init";
import { Player } from "@src/models/player";
import { User } from "@src/models/user";
import { Server, Socket } from "socket.io";

@Injectable()
export class MatchmakingService {
  private waitingQueue: string[] = []; // Store waiting players for blind matches
  private invitationMatches: Map<string, string[]> = new Map(); // Store invitation-based matches

  private async handleBlindGame(
    initGameRequest: initGameRequestDto,
    client: Socket
  ) {
    const user = new User(initGameRequest.id, initGameRequest.name, client.id);

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
  }

  // Handles blind matchmaking logic
  matchPlayer(playerId: string, server: Server): void {
    if (this.waitingQueue.length > 0) {
      const opponentId = this.waitingQueue.shift();
      this.startGame(playerId, opponentId, server);
    } else {
      this.waitingQueue.push(playerId);
      server
        .to(playerId)
        .emit("waitingForMatch", { message: "Waiting for another player..." });
    }
  }

  // Handles invitation-based matchmaking logic
  joinGameWithInvite(
    playerId: string,
    inviteCode: string,
    server: Server
  ): void {
    const players = this.invitationMatches.get(inviteCode) || [];
    players.push(playerId);

    if (players.length === 2) {
      this.startGame(players[0], players[1], server);
      this.invitationMatches.delete(inviteCode); // Remove the invite once the game starts
    } else {
      this.invitationMatches.set(inviteCode, players);
      server.to(playerId).emit("waitingForInvitee", {
        message: "Waiting for the other player to join...",
      });
    }
  }

  // Start a game between two players
  private startGame(
    player1Id: string,
    player2Id: string,
    server: Server
  ): void {
    server.to(player1Id).emit("gameStart", { opponentId: player2Id });
    server.to(player2Id).emit("gameStart", { opponentId: player1Id });
  }

  // Handle player leaving the queue or game
  handlePlayerLeave(playerId: string): void {
    this.waitingQueue = this.waitingQueue.filter((id) => id !== playerId);
    for (const [inviteCode, players] of this.invitationMatches.entries()) {
      if (players.includes(playerId)) {
        this.invitationMatches.delete(inviteCode);
        break;
      }
    }
  }
}
