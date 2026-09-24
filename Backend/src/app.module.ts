import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigModule as AppConfigModule } from './config/config.module.js';
import { CommonModule } from './common/common.module.js';
import { DatabaseModule } from './database/database.module.js';
import { TenantsModule } from './tenants/tenants.module.js';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { BranchesModule } from './branches/branches.module.js';
import { MenuModule } from './menu/menu.module.js';
import { IngredientsModule } from './ingredients/ingredients.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { KitchenModule } from './kitchen/kitchen.module.js';
import { StaffModule } from './staff/staff.module.js';
import { DeliveryModule } from './delivery/delivery.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { RealtimeModule } from './realtime/realtime.module.js';
import { LocationModule } from './location/location.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { AiModule } from './ai/ai.module.js';
import { SearchModule } from './search/search.module.js';
import { CouponsModule } from './coupons/coupons.module.js';
import { LoyaltyModule } from './loyalty/loyalty.module.js';
import { AuditModule } from './audit/audit.module.js';
import { HealthModule } from './health/health.module.js';
import { TablesModule } from './tables/tables.module.js';

import { DropsModule } from './drops/drops.module.js';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AppConfigModule,
    CommonModule,
    DatabaseModule,
    TenantsModule,
    RestaurantsModule,
    BranchesModule,
    MenuModule,
    IngredientsModule,
    InventoryModule,
    DropsModule,
    ReservationsModule,
    OrdersModule,
    KitchenModule,
    StaffModule,
    DeliveryModule,
    PaymentsModule,
    ReviewsModule,
    NotificationsModule,
    RealtimeModule,
    LocationModule,
    AnalyticsModule,
    AiModule,
    SearchModule,
    CouponsModule,
    LoyaltyModule,
    AuditModule,
    HealthModule,
    TablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}