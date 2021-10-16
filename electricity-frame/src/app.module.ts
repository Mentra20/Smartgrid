import { Module } from '@nestjs/common';

import { ElectricityFrameModule } from './electricity-frame/electricity-frame.module';

@Module({
  imports: [
    ElectricityFrameModule
  ],
})
export class AppModule {}
