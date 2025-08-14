import { SetMetadata } from '@nestjs/common';

export const Role = (roles: Array<string>) => SetMetadata('roles', roles);
