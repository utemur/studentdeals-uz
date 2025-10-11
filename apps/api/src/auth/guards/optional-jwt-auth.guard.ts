import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Auth Guard
 * 
 * Allows requests without authentication to pass through,
 * but still validates and attaches user if token is present.
 * 
 * Use this for endpoints that work for both authenticated
 * and anonymous users (e.g., feedback submission).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Always return true to allow request through
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // Return user if present, null if not
    // Don't throw error for missing/invalid token
    return user || null;
  }
}

