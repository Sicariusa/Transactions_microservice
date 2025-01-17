// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
// import { Inject } from '@nestjs/common';
// import { ClientProxy } from '@nestjs/microservices';
// import { firstValueFrom } from 'rxjs';
// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromHeader(request);

//         if (!token) {
//             throw new UnauthorizedException('No token provided');
//         }

//         // Validate the token with Auth service
//         try {
//             const response = await firstValueFrom(
//                 // this.authClient.send('validate_token', { token })
//             );

//             if (!response.isValid) {
//                 throw new UnauthorizedException('Invalid token');
//             }

//             // Attach user information to the request
//             request.user = { id: response.userId };
//             return true;
//         } catch (err) {
//             throw new UnauthorizedException('Token validation failed');
//         }
//     }

//     private extractTokenFromHeader(request: any): string | undefined {
//         const [type, token] = request.headers.authorization?.split(' ') ?? [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }
