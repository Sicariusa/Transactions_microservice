import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalService {
  constructor(private readonly httpService: HttpService) {}

  async validateUserToken(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${process.env.USER_SERVICE_URL}/auth/validate`, { token })
      );
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  async notifyAnalytics(transactionData: any): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.post(`${process.env.ANALYSIS_SERVICE_URL}/transactions/analyze`, transactionData)
      );
    } catch (error) {
      console.error('Failed to notify analytics service:', error);
    }
  }
}