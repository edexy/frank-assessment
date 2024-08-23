/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import 'dotenv/config';
import { firstValueFrom } from 'rxjs';

const { RAPID_API_KEY, RAPID_HOST, RAPID_URL } = process.env;

@Injectable()
export class RapidService {
  private logger = new Logger(RapidService.name);

  constructor(private httpService: HttpService) {}

  async getValuation(vin: string): Promise<any> {
    console.log("vin", vin);
    const options = {
      method: 'GET',
      url: RAPID_URL,
      params: {
        vin,
      },
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': RAPID_HOST,
      },
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.request(options),
      );

      if (response && response.data) {
        console.log("response", response);
        return response.data; // Access the actual data from the response
      }

      return null;
    } catch (err: any) {
      console.error(err?.data || err);
      this.logger.error(err);
      return null;
    }
  }
}
