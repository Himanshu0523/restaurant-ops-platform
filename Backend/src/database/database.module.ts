import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';


@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('mongo.url') ??
          config.get<string>('MONGODB_URL') ??
          config.get<string>('MONGODB_URI'),
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule , DatabaseService],
})


export class DatabaseModule {}
