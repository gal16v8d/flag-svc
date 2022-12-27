import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderGuard implements CanActivate {
  constructor(private readonly cfgService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return (
      this.cfgService.get<string>('meta.appSecKey') ===
      request?.headers?.['x-api-key']
    );
  }
}
