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
import { GARAGE_ADMIN_API_URL } from '@/core/appConfig';
import { HttpClient } from '../http-client';

export class S3GargaeClient {
  private token: string | null = null;
  private http: HttpClient;

  constructor(garageAdminApiUrl: string) {
    this.http = HttpClient.with({ baseUrl: garageAdminApiUrl });
  }

  /**
   * Update token to be used for upcoming requests
   *
   * @param token - Token to be used for upcoming requests. Set to null to destroy the stored token
   */
  async setToken(token: string | null) {
    this.token = token;
  }

  async getHealthCheckReport(): Promise<HealthReportResponse> {
    const response = await this.http.with({ token: this.token }).GET('/health');
    return checkResponse(HealthReportResponseSchema, response);
  }

  async getClusterDetails(): Promise<ClusterDetails> {
    const response = await this.http.with({ token: this.token }).GET('/status');
    return checkResponse(ClusterDetailsSchema, response);
  }

  async removeKey(keyId: string): Promise<void> {
    const response = await this.http.with({ token: this.token }).DELETE(`/key`, { params: { key: keyId } });
    await checkResponse(z.any(), response);
  }

  async createKey(keyName: string): Promise<CreatedKey> {
    const response = await this.http.with({ token: this.token }).POST('/key?list', {
      body: {
        name: keyName,
      },
    });
    const createdKey = await checkResponse(CreatedKeySchema, response);
    return createdKey;
  }

  async getKeyDetails(keyId: string): Promise<KeyDetails> {
    const response = await this.http.with({ token: this.token }).GET('/key', {
      params: {
        id: keyId,
        showSecretKey: 'true',
      },
    });
    const keyDetails = await checkResponse(KeyDetailsSchema, response);
    return keyDetails;
  }

  async listAllKeys(): Promise<KeyListItem[]> {
    const response = await this.http.with({ token: this.token }).GET('/key?list');
    const keys = await checkResponse(KeyListItemsSchema, response);
    return keys;
  }

  async listAllBuckets(): Promise<BucketListItem[]> {
    const reponse = await this.http.with({ token: this.token }).GET('/bucket?list');
    const buckets = await checkResponse(BucketListItemsSchema, reponse);
    return buckets;
  }

  async removeBucket(bucketId: string): Promise<void> {
    const reponse = await this.http.with({ token: this.token }).DELETE('/bucket', { params: { id: bucketId } });
    await checkResponse(z.any(), reponse);
  }

  async createBucket(request: CreateBucketRequest) {
    checkRequest(CreateBucketRequestSchema, request);
    const response = await this.http.with({ token: this.token }).POST('/bucket', {
      body: request,
    });
    const createdBucket = await checkResponse(CreateBucketResponseSchema, response);
    return createdBucket;
  }

  async allowKeyToBucket(request: AllowKeyToBucketRequest): Promise<void> {
    checkRequest(AllowKeyToBucketRequestSchema, request);
    const response = await this.http.with({ token: this.token }).POST('/bucket/allow', {
      body: request,
    });
    await checkResponse(z.any(), response);
  }

  async getCurrentLayout(): Promise<LayoutDescription> {
    const response = await this.http.with({ token: this.token }).GET('/layout');
    return checkResponse(LayoutDescriptionSchema, response);
  }

  async updateLayout(updates: UpdateLayout): Promise<void> {
    checkRequest(UpdateLayoutSchema, updates);
    const response = await this.http.with({ token: this.token }).POST('/layout', { body: updates });
    await checkResponse(z.any(), response);
  }

  async discardLayout(nextVersion: number): Promise<void> {
    const response = await this.http
      .with({ token: this.token })
      .POST('/layout/revert', { body: { version: nextVersion } });
    await checkResponse(z.any(), response);
  }

  async applyLayout(nextVersion: number): Promise<void> {
    const response = await this.http
      .with({ token: this.token })
      .POST('/layout/apply', { body: { version: nextVersion } });
    await checkResponse(z.any(), response);
  }

  async removeLayoutNode(toRemove: RemoveLayoutNode): Promise<void> {
    checkRequest(RemoveLayoutNodeSchema, toRemove);
    const response = await this.http.with({ token: this.token }).POST('/layout', { body: toRemove });
    await checkResponse(z.any(), response);
  }
}

export const s3GarageClient = new S3GargaeClient(GARAGE_ADMIN_API_URL);
