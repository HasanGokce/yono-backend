import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import config from "./config/configuration";
import { EventsModule } from "./modules/events/events.module";
import { CmsModule } from "./modules/cms/cms.module";

console.log(process.env);

@Module({
  imports: [ConfigModule.forRoot({ load: [config] }), EventsModule, CmsModule],
})
export class AppModule {}
