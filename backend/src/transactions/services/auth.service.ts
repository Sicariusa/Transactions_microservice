import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Payload, Transport } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://uNXXla3rKflI6s8p:mLjDBJ~GppHabuq.oBxWCB11pHUJrHc8@junction.proxy.rlwy.net:34338'], // Update with your RabbitMQ URL
        queue: 'auth_queue',
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