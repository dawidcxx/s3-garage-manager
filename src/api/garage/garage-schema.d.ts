export interface paths {
  '/health': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Cluster health report
     * @description Returns the global status of the cluster, the number of connected nodes (over the number of known ones), the number of healthy storage nodes (over the declared ones), and the number of healthy partitions (over the total).
     *
     */
    get: operations['GetHealth'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/status': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Describe cluster
     * @description Returns the cluster's current status, including:
     *      - ID of the node being queried and its version of the Garage daemon
     *      - Live nodes
     *      - Currently configured cluster layout
     *      - Staged changes to the cluster layout
     *
     *     *Capacity is given in bytes*
     *
     */
    get: operations['GetNodes'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/connect': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Connect a new node
     * @description Instructs this Garage node to connect to other Garage nodes at specified `<node_id>@<net_address>`. `node_id` is generated automatically on node start.
     *
     */
    post: operations['AddNode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/layout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Details on the current and staged layout
     * @description Returns the cluster's current layout, including:
     *       - Currently configured cluster layout
     *       - Staged changes to the cluster layout
     *
     *     *Capacity is given in bytes*
     *     *The info returned by this endpoint is a subset of the info returned by `GET /status`.*
     *
     */
    get: operations['GetLayout'];
    put?: never;
    /**
     * Send modifications to the cluster layout
     * @description Send modifications to the cluster layout. These modifications will be included in the staged role changes, visible in subsequent calls of `GET /layout`. Once the set of staged changes is satisfactory, the user may call `POST /layout/apply` to apply the changed changes, or `POST /layout/revert` to clear all of the staged changes in the layout.
     *
     *     Setting the capacity to `null` will configure the node as a gateway.
     *     Otherwise, capacity must be now set in bytes (before Garage 0.9 it was arbitrary weights).
     *     For example to declare 100GB, you must set `capacity: 100000000000`.
     *
     *     Garage uses internally the International System of Units (SI), it assumes that 1kB = 1000 bytes, and displays storage as kB, MB, GB (and not KiB, MiB, GiB that assume 1KiB = 1024 bytes).
     *
     */
    post: operations['AddLayout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/layout/apply': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Apply staged layout
     * @description Applies to the cluster the layout changes currently registered as staged layout changes.
     *
     *     *Note: do not try to parse the `message` field of the response, it is given as an array of string specifically because its format is not stable.*
     *
     */
    post: operations['ApplyLayout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/layout/revert': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Clear staged layout
     * @description Clears all of the staged layout changes.
     *
     */
    post: operations['RevertLayout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key?list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List all keys
     * @description Returns all API access keys in the cluster.
     *
     */
    get: operations['ListKeys'];
    put?: never;
    /**
     * Create a new API key
     * @description Creates a new API access key.
     *
     */
    post: operations['AddKey'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get key information
     * @description Return information about a specific key like its identifiers, its permissions and buckets on which it has permissions.
     *     You can search by specifying the exact key identifier (`id`) or by specifying a pattern (`search`).
     *
     *     For confidentiality reasons, the secret key is not returned by default: you must pass the `showSecretKey` query parameter to get it.
     *
     */
    get: operations['GetKey'];
    put?: never;
    /**
     * Update a key
     * @description Updates information about the specified API access key.
     *
     *     *Note: the secret key is not returned in the response, `null` is sent instead.*
     *
     */
    post: operations['UpdateKey'];
    /**
     * Delete a key
     * @description Delete a key from the cluster. Its access will be removed from all the buckets. Buckets are not automatically deleted and can be dangling. You should manually delete them before.
     *
     */
    delete: operations['DeleteKey'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/key/import': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Import an existing key
     * @description Imports an existing API key. This feature must only be used for migrations and backup restore.
     *
     *     **Do not use it to generate custom key identifiers or you will break your Garage cluster.**
     *
     */
    post: operations['ImportKey'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket?list': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * List all buckets
     * @description List all the buckets on the cluster with their UUID and their global and local aliases.
     *
     */
    get: operations['ListBuckets'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /**
     * Get a bucket
     * @description Given a bucket identifier (`id`) or a global alias (`alias`), get its information.
     *     It includes its aliases, its web configuration, keys that have some permissions
     *     on it, some statistics (number of objects, size), number of dangling multipart uploads,
     *     and its quotas (if any).
     *
     */
    get: operations['GetBucketInfo'];
    /**
     * Update a bucket
     * @description All fields (`websiteAccess` and `quotas`) are optional.
     *     If they are present, the corresponding modifications are applied to the bucket, otherwise nothing is changed.
     *
     *     In `websiteAccess`: if `enabled` is `true`, `indexDocument` must be specified.
     *     The field `errorDocument` is optional, if no error document is set a generic
     *     error message is displayed when errors happen. Conversely, if `enabled` is
     *     `false`, neither `indexDocument` nor `errorDocument` must be specified.
     *
     *     In `quotas`: new values of `maxSize` and `maxObjects` must both be specified, or set to `null`
     *     to remove the quotas. An absent value will be considered the same as a `null`. It is not possible
     *     to change only one of the two quotas.
     *
     */
    put: operations['UpdateBucket'];
    /**
     * Create a bucket
     * @description Creates a new bucket, either with a global alias, a local one, or no alias at all.
     *     Technically, you can also specify both `globalAlias` and `localAlias` and that would create two aliases.
     *
     */
    post: operations['CreateBucket'];
    /**
     * Delete a bucket
     * @description Delete a bucket.Deletes a storage bucket. A bucket cannot be deleted if it is not empty.
     *
     *     **Warning:** this will delete all aliases associated with the bucket!
     *
     */
    delete: operations['DeleteBucket'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket/allow': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Allow key
     * @description ⚠️ **DISCLAIMER**: Garage's developers are aware that this endpoint has an unconventional semantic. Be extra careful when implementing it, its behavior is not obvious.
     *
     *     Allows a key to do read/write/owner operations on a bucket.
     *
     *     Flags in permissions which have the value true will be activated. Other flags will remain unchanged (ie. they will keep their internal value).
     *
     *     For example, if you set read to true, the key will be allowed to read the bucket.
     *     If you set it to false, the key will keeps its previous read permission.
     *     If you want to disallow read for the key, check the DenyBucketKey operation.
     *
     */
    post: operations['AllowBucketKey'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket/deny': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    /**
     * Deny key
     * @description ⚠️ **DISCLAIMER**: Garage's developers are aware that this endpoint has an unconventional semantic. Be extra careful when implementing it, its behavior is not obvious.
     *
     *     Denies a key from doing read/write/owner operations on a bucket.
     *
     *     Flags in permissions which have the value true will be deactivated. Other flags will remain unchanged.
     *
     *     For example, if you set read to true, the key will be denied from reading.
     *     If you set read to false,  the key will keep its previous permissions.
     *     If you want the key to have the reading permission, check the AllowBucketKey operation.
     *
     */
    post: operations['DenyBucketKey'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket/alias/global': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Add a global alias
     * @description Add a global alias to the target bucket
     *
     */
    put: operations['PutBucketGlobalAlias'];
    post?: never;
    /**
     * Delete a global alias
     * @description Delete a global alias from the target bucket
     *
     */
    delete: operations['DeleteBucketGlobalAlias'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/bucket/alias/local': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    /**
     * Add a local alias
     * @description Add a local alias, bound to specified account, to the target bucket
     *
     */
    put: operations['PutBucketLocalAlias'];
    post?: never;
    /**
     * Delete a local alias
     * @description Delete a local alias, bound to specified account, from the target bucket
     *
     */
    delete: operations['DeleteBucketLocalAlias'];
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    NodeNetworkInfo: {
      /** @example 6a8e08af2aab1083ebab9b22165ea8b5b9d333b60a39ecd504e85cc1f432c36f */
      id?: string;
      /** @example 10.0.0.11:3901 */
      addr: string;
      /** @example true */
      isUp: boolean;
      /** @example 9 */
      lastSeenSecsAgo: number | null;
      /** @example node1 */
      hostname: string;
    };
    NodeClusterInfo: {
      /** @example dc1 */
      zone: string;
      /**
       * Format: int64
       * @example 4
       */
      capacity?: number | null;
      /**
       * @description User defined tags, put whatever makes sense for you, these tags are not interpreted by Garage
       *
       * @example [
       *       "gateway",
       *       "fast"
       *     ]
       */
      tags: string[];
    };
    NodeRoleChange: components['schemas']['NodeRoleRemove'] | components['schemas']['NodeRoleUpdate'];
    NodeRoleRemove: {
      /** @example 6a8e08af2aab1083ebab9b22165ea8b5b9d333b60a39ecd504e85cc1f432c36f */
      id: string;
      /** @example true */
      remove: boolean;
    };
    NodeRoleUpdate: {
      /** @example 6a8e08af2aab1083ebab9b22165ea8b5b9d333b60a39ecd504e85cc1f432c36f */
      id: string;
      /** @example dc1 */
      zone: string;
      /**
       * Format: int64
       * @example 150000000000
       */
      capacity: number | null;
      /** @example [
       *       "gateway",
       *       "fast"
       *     ] */
      tags: string[];
    };
    ClusterLayout: {
      /** @example 12 */
      version: number;
      /** @example [
       *       {
       *         "id": "ec79480e0ce52ae26fd00c9da684e4fa56658d9c64cdcecb094e936de0bfe71f",
       *         "zone": "madrid",
       *         "capacity": 300000000000,
       *         "tags": [
       *           "fast",
       *           "amd64"
       *         ]
       *       },
       *       {
       *         "id": "4a6ae5a1d0d33bf895f5bb4f0a418b7dc94c47c0dd2eb108d1158f3c8f60b0ff",
       *         "zone": "geneva",
       *         "capacity": 700000000000,
       *         "tags": [
       *           "arm64"
       *         ]
       *       }
       *     ] */
      roles: components['schemas']['NodeClusterInfo'][];
      /** @example [
       *       {
       *         "id": "e2ee7984ee65b260682086ec70026165903c86e601a4a5a501c1900afe28d84b",
       *         "zone": "geneva",
       *         "capacity": 800000000000,
       *         "tags": [
       *           "gateway"
       *         ]
       *       },
       *       {
       *         "id": "4a6ae5a1d0d33bf895f5bb4f0a418b7dc94c47c0dd2eb108d1158f3c8f60b0ff",
       *         "remove": true
       *       }
       *     ] */
      stagedRoleChanges: components['schemas']['NodeRoleChange'][];
    };
    LayoutVersion: {
      /** @example 13 */
      version: number;
    };
    KeyInfo: {
      /** @example test-key */
      name?: string;
      /** @example GK31c2f218a2e44f485b94239e */
      accessKeyId?: string;
      /** @example b892c0665f0ada8a4755dae98baa3b133590e11dae3bcc1f9d769d67f16c3835 */
      secretAccessKey?: string | null;
      permissions?: {
        /** @example false */
        createBucket?: boolean;
      };
      buckets?: {
        /** @example 70dc3bed7fe83a75e46b66e7ddef7d56e65f3c02f9f80b6749fb97eccb5e1033 */
        id?: string;
        globalAliases?: string[];
        localAliases?: string[];
        permissions?: {
          /** @example true */
          read?: boolean;
          /** @example true */
          write?: boolean;
          /** @example false */
          owner?: boolean;
        };
      }[];
    };
    BucketInfo: {
      /** @example afa8f0a22b40b1247ccd0affb869b0af5cff980924a20e4b5e0720a44deb8d39 */
      id?: string;
      globalAliases?: string[];
      /** @example true */
      websiteAccess?: boolean;
      websiteConfig?: {
        /** @example index.html */
        indexDocument?: string;
        /** @example error/400.html */
        errorDocument?: string;
      } | null;
      keys?: components['schemas']['BucketKeyInfo'][];
      /**
       * Format: int64
       * @example 14827
       */
      objects?: number;
      /**
       * Format: int64
       * @example 13189855625
       */
      bytes?: number;
      /** @example 0 */
      unfinishedUploads?: number;
      quotas?: {
        /**
         * Format: int64
         * @example null
         */
        maxSize?: number | null;
        /**
         * Format: int64
         * @example null
         */
        maxObjects?: number | null;
      };
    };
    BucketKeyInfo: {
      accessKeyId?: string;
      name?: string;
      permissions?: {
        /** @example true */
        read?: boolean;
        /** @example true */
        write?: boolean;
        /** @example true */
        owner?: boolean;
      };
      bucketLocalAliases?: string[];
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  GetHealth: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Information about the queried node, its environment and the current layout
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example healthy */
            status: string;
            /**
             * Format: int64
             * @example 4
             */
            knownNodes: number;
            /**
             * Format: int64
             * @example 4
             */
            connectedNodes: number;
            /**
             * Format: int64
             * @example 3
             */
            storageNodes: number;
            /**
             * Format: int64
             * @example 3
             */
            storageNodesOk: number;
            /**
             * Format: int64
             * @example 256
             */
            partitions: number;
            /**
             * Format: int64
             * @example 256
             */
            partitionsQuorum: number;
            /**
             * Format: int64
             * @example 256
             */
            partitionsAllOk: number;
          };
        };
      };
      /** @description The server can not answer your request because it is in a bad state
       *      */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetNodes: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Information about the queried node, its environment and the current layout
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example ec79480e0ce52ae26fd00c9da684e4fa56658d9c64cdcecb094e936de0bfe71f */
            node: string;
            /** @example v0.9.0 */
            garageVersion: string;
            /** @example [
             *       "k2v",
             *       "lmdb",
             *       "sqlite",
             *       "consul-discovery",
             *       "kubernetes-discovery",
             *       "metrics",
             *       "telemetry-otlp",
             *       "bundled-libs"
             *     ] */
            garageFeatures: string[];
            /** @example 1.68.0 */
            rustVersion: string;
            /** @example LMDB (using Heed crate) */
            dbEngine: string;
            /** @example [
             *       {
             *         "id": "ec79480e0ce52ae26fd00c9da684e4fa56658d9c64cdcecb094e936de0bfe71f",
             *         "addr": "10.0.0.11:3901",
             *         "isUp": true,
             *         "lastSeenSecsAgo": 9,
             *         "hostname": "orion"
             *       },
             *       {
             *         "id": "4a6ae5a1d0d33bf895f5bb4f0a418b7dc94c47c0dd2eb108d1158f3c8f60b0ff",
             *         "addr": "10.0.0.12:3901",
             *         "isUp": true,
             *         "lastSeenSecsAgo": 13,
             *         "hostname": "pegasus"
             *       },
             *       {
             *         "id": "e2ee7984ee65b260682086ec70026165903c86e601a4a5a501c1900afe28d84b",
             *         "addr": "10.0.0.13:3901",
             *         "isUp": true,
             *         "lastSeenSecsAgo": 2,
             *         "hostname": "neptune"
             *       }
             *     ] */
            knownNodes: components['schemas']['NodeNetworkInfo'][];
            layout: components['schemas']['ClusterLayout'];
          };
        };
      };
      /** @description The server can not answer your request because it is in a bad state
       *      */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  AddNode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': string[];
      };
    };
    responses: {
      /** @description The request has been handled correctly but it does not mean that all connection requests succeeded; some might have fail, you need to check the body!
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example true */
            success?: boolean;
            /** @example null */
            error?: string | null;
          }[];
        };
      };
      /** @description Your request is malformed, check your JSON
       *      */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not answer your request because it is in a bad state
       *      */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetLayout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns the cluster's current cluster layout:
       *       - Currently configured cluster layout
       *       - Staged changes to the cluster layout
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ClusterLayout'];
        };
      };
      /** @description The server can not answer your request because it is in a bad state
       *      */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  AddLayout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description To add a new node to the layout or to change the configuration of an existing node, simply set the values you want (`zone`, `capacity`, and `tags`).
     *     To remove a node, simply pass the `remove: true` field.
     *     This logic is represented in OpenAPI with a "One Of" object.
     *
     *     Contrary to the CLI that may update only a subset of the fields capacity, zone and tags, when calling this API all of these values must be specified.
     *      */
    requestBody: {
      content: {
        'application/json': components['schemas']['NodeRoleChange'][];
      };
    };
    responses: {
      /** @description The layout modification has been correctly staged */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ClusterLayout'];
        };
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  ApplyLayout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Similarly to the CLI, the body must include the version of the new layout that will be created, which MUST be 1 + the value of the currently existing layout in the cluster.
     *      */
    requestBody: {
      content: {
        'application/json': components['schemas']['LayoutVersion'];
      };
    };
    responses: {
      /** @description The staged layout has been applied as the new layout of the cluster, a rebalance has been triggered. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            /** @example [
             *       "==== COMPUTATION OF A NEW PARTITION ASSIGNATION ====",
             *       "",
             *       "Partitions are replicated 1 times on at least 1 distinct zones.",
             *       "",
             *       "Optimal partition size:                     419.4 MB (3 B in previous layout)",
             *       "Usable capacity / total cluster capacity:   107.4 GB / 107.4 GB (100.0 %)",
             *       "Effective capacity (replication factor 1):  107.4 GB",
             *       "",
             *       "A total of 0 new copies of partitions need to be transferred.",
             *       "",
             *       "dc1                 Tags  Partitions        Capacity  Usable capacity\n  6a8e08af2aab1083  a,v   256 (0 new)       107.4 GB  107.4 GB (100.0%)\n  TOTAL                   256 (256 unique)  107.4 GB  107.4 GB (100.0%)\n\n"
             *     ] */
            message: string[];
            layout: components['schemas']['ClusterLayout'];
          };
        };
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  RevertLayout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Reverting the staged changes is done by incrementing the version number and clearing the contents of the staged change list. Similarly to the CLI, the body must include the incremented version number, which MUST be 1 + the value of the currently existing layout in the cluster.
     *      */
    requestBody: {
      content: {
        'application/json': components['schemas']['LayoutVersion'];
      };
    };
    responses: {
      /** @description The staged layout has been cleared, you can start again sending modification from a fresh copy with `POST /layout`. */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  ListKeys: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns the key identifier (aka `AWS_ACCESS_KEY_ID`) and its associated, human friendly, name if any (otherwise return an empty string)
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            id: string;
            name?: string;
          }[];
        };
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  AddKey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description You can set a friendly name for this key.
     *     If you don't want to, you can set the name to `null`.
     *
     *     *Note: the secret key is returned in the response.*
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example test-key */
          name?: string | null;
        };
      };
    };
    responses: {
      /** @description The key has been added */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyInfo'];
        };
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetKey: {
    parameters: {
      query?: {
        /**
         * @description The exact API access key generated by Garage.
         *
         *     Incompatible with `search`.
         *
         * @example GK31c2f218a2e44f485b94239e
         */
        id?: string;
        /**
         * @description A pattern (beginning or full string) corresponding to a key identifier or friendly name.
         *
         *     Incompatible with `id`.
         *
         * @example test-k
         */
        search?: string;
        /**
         * @description Wether or not the secret key should be returned in the response
         * @example true
         */
        showSecretKey?: 'true' | 'false';
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns information about the key
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyInfo'];
        };
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  UpdateKey: {
    parameters: {
      query: {
        /**
         * @description The exact API access key generated by Garage
         * @example GK31c2f218a2e44f485b94239e
         */
        id: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description For a given key, provide a first set with the permissions to grant, and a second set with the permissions to remove
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example test-key */
          name?: string;
          /** @example null */
          allow?: {
            /** @example true */
            createBucket?: boolean;
          };
          deny?: {
            /** @example true */
            createBucket?: boolean;
          };
        };
      };
    };
    responses: {
      /** @description Returns information about the key
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyInfo'];
        };
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  DeleteKey: {
    parameters: {
      query: {
        /**
         * @description The exact API access key generated by Garage
         * @example GK31c2f218a2e44f485b94239e
         */
        id: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description The key has been deleted */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  ImportKey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Information on the key to import
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example test-key */
          name: string | null;
          /** @example GK31c2f218a2e44f485b94239e */
          accessKeyId: string;
          /** @example b892c0665f0ada8a4755dae98baa3b133590e11dae3bcc1f9d769d67f16c3835 */
          secretAccessKey: string;
        };
      };
    };
    responses: {
      /** @description The key has been imported into the system */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['KeyInfo'];
        };
      };
      /** @description Invalid syntax or requested change */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  ListBuckets: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns the UUID of the bucket and all its aliases
       *      */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            id: string;
            globalAliases?: string[];
            localAliases?: {
              alias: string;
              accessKeyId: string;
            }[];
          }[];
        };
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  GetBucketInfo: {
    parameters: {
      query?: {
        /**
         * @description The exact bucket identifier, a 32 bytes hexadecimal string.
         *
         *     Incompatible with `alias`.
         *
         * @example b4018dc61b27ccb5c64ec1b24f53454bbbd180697c758c4d47a22a8921864a87
         */
        id?: string;
        /**
         * @description The exact global alias of one of the existing buckets.
         *
         *     Incompatible with `id`.
         *
         * @example my_documents
         */
        alias?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  UpdateBucket: {
    parameters: {
      query: {
        /**
         * @description The exact bucket identifier, a 32 bytes hexadecimal string
         * @example b4018dc61b27ccb5c64ec1b24f53454bbbd180697c758c4d47a22a8921864a87
         */
        id: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Requested changes on the bucket. Both root fields are optionals.
     *      */
    requestBody: {
      content: {
        'application/json': {
          websiteAccess?: {
            /** @example true */
            enabled?: boolean;
            /** @example index.html */
            indexDocument?: string;
            /** @example error/400.html */
            errorDocument?: string;
          };
          quotas?: {
            /**
             * Format: int64
             * @example 19029801
             */
            maxSize?: number | null;
            /**
             * Format: int64
             * @example null
             */
            maxObjects?: number | null;
          };
        };
      };
    };
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your body. */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  CreateBucket: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Aliases to put on the new bucket
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example my_documents */
          globalAlias?: string;
          localAlias?: {
            accessKeyId?: string;
            alias?: string;
            allow?: {
              /** @example true */
              read?: boolean;
              /** @example true */
              write?: boolean;
              /** @example true */
              owner?: boolean;
            };
          };
        };
      };
    };
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description The payload is not formatted correctly */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  DeleteBucket: {
    parameters: {
      query: {
        /**
         * @description The exact bucket identifier, a 32 bytes hexadecimal string
         * @example b4018dc61b27ccb5c64ec1b24f53454bbbd180697c758c4d47a22a8921864a87
         */
        id: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Bucket has been deleted */
      204: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket is not empty */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  AllowBucketKey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Aliases to put on the new bucket
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
          bucketId: string;
          /** @example GK31c2f218a2e44f485b94239e */
          accessKeyId: string;
          permissions: {
            /** @example true */
            read: boolean;
            /** @example true */
            write: boolean;
            /** @example true */
            owner: boolean;
          };
        };
      };
    };
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  DenyBucketKey: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** @description Aliases to put on the new bucket
     *      */
    requestBody: {
      content: {
        'application/json': {
          /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
          bucketId: string;
          /** @example GK31c2f218a2e44f485b94239e */
          accessKeyId: string;
          permissions: {
            /** @example true */
            read: boolean;
            /** @example true */
            write: boolean;
            /** @example true */
            owner: boolean;
          };
        };
      };
    };
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  PutBucketGlobalAlias: {
    parameters: {
      query: {
        /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
        id: string;
        /** @example my_documents */
        alias: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  DeleteBucketGlobalAlias: {
    parameters: {
      query: {
        /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
        id: string;
        /** @example my_documents */
        alias: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  PutBucketLocalAlias: {
    parameters: {
      query: {
        /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
        id: string;
        /** @example GK31c2f218a2e44f485b94239e */
        accessKeyId: string;
        /** @example my_documents */
        alias: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
  DeleteBucketLocalAlias: {
    parameters: {
      query: {
        /** @example e6a14cd6a27f48684579ec6b381c078ab11697e6bc8513b72b2f5307e25fff9b */
        id: string;
        /** @example GK31c2f218a2e44f485b94239e */
        accessKeyId: string;
        /** @example my_documents */
        alias: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Returns exhaustive information about the bucket */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['BucketInfo'];
        };
      };
      /** @description Bad request, check your request body */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description Bucket not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
      /** @description The server can not handle your request. Check your connectivity with the rest of the cluster. */
      500: {
        headers: {
          [name: string]: unknown;
        };
        content?: never;
      };
    };
  };
}
