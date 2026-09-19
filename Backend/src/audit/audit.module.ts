import { Module } from '@nestjs/common';
import { AuditService } from './audit.service.js';

@Module({
  providers: [AuditService]
})
export class AuditModule {}
