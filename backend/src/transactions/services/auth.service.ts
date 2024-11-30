import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL ], // Use environment variable
        queue: process.env.RABBITMQ_QUEUE || 'auth_queue', // Use environment variable
        queueOptions: {
          durable: false
        },
      },
    });
  }
  
  async validateToken(token: string): Promise<any> {
    console.log('Received token:', token);
    return this.client.send({ cmd: 'validate_user' }, token).toPromise();
  }
}