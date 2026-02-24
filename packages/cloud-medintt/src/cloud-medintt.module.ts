import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CloudMedinttService } from "./cloud-medintt.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CloudMedinttService],
  exports: [CloudMedinttService],
})
export class CloudMedinttModule {}
