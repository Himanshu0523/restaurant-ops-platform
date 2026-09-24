import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Tenant = Reflector.createDecorator<string[]>();

/**
 * Route parameter decorator — extracts tenantId from the JWT payload.
 * Usage: @TenantId() tenantId: string
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.tenantId as string;
  },
);
