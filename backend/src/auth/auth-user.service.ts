import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AuthUserService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  get user() {
    return this.request.user;
  }
}
