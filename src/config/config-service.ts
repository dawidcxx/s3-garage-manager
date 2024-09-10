export class ConfigService {
  get garageAminApiUrl(): string {
    return '/s3admin';
  }

  get garageApiAdminToken(): string {
    return '';
  }
}

export const configService = new ConfigService();
