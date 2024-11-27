import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add health check endpoint
  app.getHttpAdapter().getInstance().get('/health', (req, res) => res.json({ status: 'ok' }));

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Connect to RabbitMQ for microservice communication
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], // Ensure this is set in your .env
      queue: 'transactions_queue', // Queue name
      queueOptions: {
        durable: true,
      },
    },
  });

  // Start the microservice and HTTP server
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);

  console.log(`Transactions service is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
