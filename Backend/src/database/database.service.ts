import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';


@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    // Injects the default Mongoose connection into this.connection
    constructor(@InjectConnection() private readonly connection: Connection){}

    isConnected(): boolean {
        return this.connection.readyState === 1;
    }

    getConnectionState(): string {
        const states: Record<number , string> = {
            0: 'disconnected',
            1: 'connected', 
            2: 'connecting',
            3: 'disconnecting',
        };
        return states[this.connection.readyState] ?? 'unknown';
    }

    async ping(): Promise<boolean> {
        if (!this.connection.db) return false;
        try {
            await this.connection.db.admin().ping();
            return true;
        } catch (err) {
            this.logger.error('MongoDB ping failed' , err as Error);
            return false;
        }
    }
}