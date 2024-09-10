import { checkRequest, checkResponse } from '../api-utils';
import {
  AllowKeyToBucketRequest,
  AllowKeyToBucketRequestSchema,
  CreateBucketRequest,
  CreateBucketRequestSchema,
  RemoveLayoutNode,
  RemoveLayoutNodeSchema,
  UpdateLayout,
  UpdateLayoutSchema,
} from './s3-garage-client-requests';
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
  LayoutDescription,
  LayoutDescriptionSchema,
} from './s3-garage-client-responses';
import { z } from 'zod';
import { isNil } from '@/lib/util/isNil';

export class S3GargaeClient {
  private readonly client: Client<paths>;
  private authMiddleware: Middleware | null = null;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient<paths>({
      baseUrl: this.configService.garageAminApiUrl,
      cache: 'no-cache',
    });
    const authMiddleware: Middleware = {
      onRequest({ request }) {
        request.headers.set('Authorization', ``);
        return request;
      },
      onResponse({ response }) {
        return response;
      },
    };
    this.client.use(authMiddleware);
  }

  /**
   * Update token to be used for upcoming requests
   * 
   * @param token - Token to be used for upcoming requests. Set to null to destroy the stored token
   */
  async setToken(token: string | null) {
    if (isNil(token)) {
      if (this.authMiddleware) {
        this.client.eject(this.authMiddleware);
      }
      return
    }

    if (this.authMiddleware) {
      this.client.eject(this.authMiddleware);
    }

    this.authMiddleware = {
      onRequest({ request }) {
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
        return request;
      },
      onResponse({ response }) {
        return response;
      },
    };
    this.client.use(this.authMiddleware);
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
    const reponse = await this.client.DELETE('/bucket', { params: { query: { id: bucketId } } });
    checkResponse(z.any(), reponse);
  }

  async createBucket(request: CreateBucketRequest) {
    checkRequest(CreateBucketRequestSchema, request);
    const response = await this.client.POST('/bucket', {
      body: request,
    });
    const createdBucket = checkResponse(CreateBucketResponseSchema, response);
    return createdBucket;
  }

  async allowKeyToBucket(request: AllowKeyToBucketRequest): Promise<void> {
    checkRequest(AllowKeyToBucketRequestSchema, request);
    const response = await this.client.POST('/bucket/allow', {
      body: request,
    });
    checkResponse(z.any(), response);
  }

  async getCurrentLayout(): Promise<LayoutDescription> {
    const response = await this.client.GET('/layout');
    return checkResponse(LayoutDescriptionSchema, response);
  }

  async updateLayout(updates: UpdateLayout): Promise<void> {
    checkRequest(UpdateLayoutSchema, updates);
    const response = await this.client.POST('/layout', { body: updates });
    checkResponse(z.any(), response);
  }

  async discardLayout(nextVersion: number): Promise<void> {
    const response = await this.client.POST('/layout/revert', { body: { version: nextVersion } });
    checkResponse(z.any(), response);
  }

  async applyLayout(nextVersion: number): Promise<void> {
    const response = await this.client.POST('/layout/apply', { body: { version: nextVersion } });
    checkResponse(z.any(), response);
  }

  async removeLayoutNode(toRemove: RemoveLayoutNode): Promise<void> {
    checkRequest(RemoveLayoutNodeSchema, toRemove);
    const response = await this.client.POST('/layout', { body: toRemove });
    checkResponse(z.any(), response);
  }
}

export const s3GarageClient = new S3GargaeClient(configService);
