import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './schemas/tenant.schema.js';
import { TenantsController } from './tenants.controller.js';
import { TenantsService } from './tenants.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
      UserModule,
    ],
    controllers: [TenantsController],
    providers: [TenantsService],
    exports: [TenantsService],
})
export class TenantsModule {}