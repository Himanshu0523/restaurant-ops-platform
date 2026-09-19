import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import configuration from './configuration.js';
import databaseConfig from './database.config.js';
import jwtConfig from './jwt.config.js';
import redisConfig from './redis.config.js';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [configuration , databaseConfig , jwtConfig , redisConfig],
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}
