export class ConfigService {
  get garageAminApiUrl(): string {
    return '/s3admin';
  }
}

export const configService = new ConfigService();
