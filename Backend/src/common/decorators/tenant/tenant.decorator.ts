import { Reflector } from '@nestjs/core';

export const Tenant = Reflector.createDecorator<string[]>();
