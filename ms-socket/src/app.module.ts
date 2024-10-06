import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import config from "./config/configuration";
import { EventsModule } from "./events/events.module";
import { CmsModule } from "./cms/cms.module";
import { GameModule } from './game/game.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { SocketModule } from './socket/socket.module';

console.log(process.env);

@Module({
  imports: [ConfigModule.forRoot({ load: [config] }), EventsModule, CmsModule, GameModule, MatchmakingModule, SocketModule],
})
export class AppModule {}
