import { checkRequest, checkResponse } from '../api-utils';
import { CreateBucketRequest, CreateBucketRequestSchema } from './s3-garage-client-requests';
import { configService, ConfigService } from '@/config/config-service';
import createClient, { Client, Middleware } from 'openapi-fetch';
import { paths } from './garage-schema';
import {
  BucketListItem,
  BucketListItemsSchema,
  ClusterDetails,
  ClusterDetailsSchema,
  CreateBucketResponseSchema,
  CreatedKey,
  CreatedKeySchema,
  HealthReportResponse,
  HealthReportResponseSchema,
  KeyDetails,
  KeyDetailsSchema,
  KeyListItem,
  KeyListItemsSchema,
} from './s3-garage-client-responses';

export class S3GargaeClient {
  private readonly client: Client<paths>;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient<paths>({
      baseUrl: this.configService.garageAminApiUrl,
      cache: 'no-cache',
    });
    const authMiddleware: Middleware = {
      onRequest({ request }) {
        request.headers.set('Authorization', `Bearer d06wit4G1EZ36AK+ba3kkWCSjiXbQd91kr8iyPAkak4=`);
        return request;
      },
      onResponse({ response }) {
        return response;
      },
    };
    this.client.use(authMiddleware);
  }

  async getHealthCheckReport(): Promise<HealthReportResponse> {
    const response = await this.client.GET('/health');
    return checkResponse(HealthReportResponseSchema, response);
  }

  async getClusterDetails(): Promise<ClusterDetails> {
    const response = await this.client.GET('/status');
    return checkResponse(ClusterDetailsSchema, response);
  }

  async removeKey(keyId: string) {
    await this.client.DELETE('/key', {
      params: { query: { id: keyId } },
    });
  }

  async createKey(keyName: string): Promise<CreatedKey> {
    const response = await this.client.POST('/key?list', {
      body: {
        name: keyName,
      },
    });
    const createdKey = checkResponse(CreatedKeySchema, response);
    return createdKey;
  }

  async getKeyDetails(keyId: string): Promise<KeyDetails> {
    const response = await this.client.GET('/key', {
      params: { query: { id: keyId, showSecretKey: 'true' } },
    });
    const keyDetails = checkResponse(KeyDetailsSchema, response);
    return keyDetails;
  }

  async listAllKeys(): Promise<KeyListItem[]> {
    const response = await this.client.GET('/key?list');
    const keys = checkResponse(KeyListItemsSchema, response);
    return keys;
  }

  async listAllBuckets(): Promise<BucketListItem[]> {
    const reponse = await this.client.GET('/bucket?list');
    const buckets = checkResponse(BucketListItemsSchema, reponse);
    return buckets;
  }

  async removeBucket(bucketId: string): Promise<void> {
    await this.client.DELETE('/bucket', { params: { query: { id: bucketId } } });
  }

  async createBucket(request: CreateBucketRequest) {
    checkRequest(CreateBucketRequestSchema, request);
    const response = await this.client.POST('/bucket', {
      body: request,
    });
    const createdBucket = checkResponse(CreateBucketResponseSchema, response);
    return createdBucket;
  }
}

export const s3GarageClient = new S3GargaeClient(configService);
