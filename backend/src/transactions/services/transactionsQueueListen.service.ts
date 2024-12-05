import { Injectable, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TransactionsQueueListenerService {
    private readonly logger = new Logger(TransactionsQueueListenerService.name);
    private readonly responseEvent = 'authResponse';

    constructor(private readonly eventEmitter: EventEmitter2) {}

    async listenForResponses() {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const responseQueue = 'transactions_queue';

        await channel.assertQueue(responseQueue, { durable: true });
        this.logger.log(`Listening for responses on queue: ${responseQueue}`);

        channel.consume(
            responseQueue,
            (msg) => {
                if (msg) {
                    const response = JSON.parse(msg.content.toString());
                    this.logger.log('Response received from Auth Service:', response);

                    // Emit the response for matching with requests
                    this.eventEmitter.emit(this.responseEvent, {
                        correlationId: msg.properties.correlationId,
                        response,
                    });

                    channel.ack(msg); // Acknowledge the message
                }
            },
            { noAck: false }
        );
    }
}
