import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.logger.warn('No token provided in request');
            throw new UnauthorizedException('No token provided');
        }

        try {
            this.logger.log(`Sending token validation request to Auth service: ${token.substring(0, 10)}...`);
            
            const response = await firstValueFrom(
                this.authClient.send('validate_token', { token })
            );

            this.logger.log(`Received response from Auth service: ${JSON.stringify(response)}`);

            if (!response.isValid) {
                this.logger.warn('Invalid token response received');
                throw new UnauthorizedException('Invalid token');
            }

            request.user = { id: response.userId };
            this.logger.log(`Token validated successfully for user: ${response.userId}`);
            return true;
        } catch (err) {
            this.logger.error(`Token validation failed: ${err.message}`);
            throw new UnauthorizedException('Failed to validate token');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}