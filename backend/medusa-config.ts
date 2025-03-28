import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// Load Env
loadEnv(process.env.NODE_ENV || "development", process.cwd());

// Variables
const PRODUCTION = process.env.NODE_ENV === "production";
const BACKEND_URL = process.env.VITE_BACKEND_URL || "http://localhost:9000";

// Export Config
module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    ...(PRODUCTION ? { redisUrl: process.env.REDIS_URL } : {}),
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },

  admin: {
    backendUrl: BACKEND_URL,
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },

  modules: [
    /* EXTERNAL MODULES */
    // redis
    ...(PRODUCTION
      ? [
          {
            resolve: "@medusajs/medusa/cache-redis",
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
          {
            resolve: "@medusajs/medusa/event-bus-redis",
            options: {
              redisUrl: process.env.REDIS_URL,
            },
          },
          {
            resolve: "@medusajs/medusa/workflow-engine-redis",
            options: {
              redis: {
                url: process.env.REDIS_URL,
              },
            },
          },
        ]
      : []),

    // aws s3
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          ...(PRODUCTION
            ? [
                {
                  resolve: "@medusajs/file-s3",
                  id: "s3",
                  options: {
                    file_url: process.env.S3_FILE_URL,
                    access_key_id: process.env.S3_ACCESS_KEY_ID,
                    secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                    region: process.env.S3_REGION,
                    bucket: process.env.S3_BUCKET,
                    endpoint: process.env.S3_ENDPOINT,
                  },
                },
              ]
            : [
                {
                  resolve: "@medusajs/medusa/file-local",
                  id: "local",
                  options: {
                    upload_dir: "static",
                    backend_url: `${BACKEND_URL}/static`,
                  },
                },
              ]),
        ],
      },
    },

    /* CUSTOM MODULES I MADE */
    // variant-media
    {
      resolve: "./src/modules/variant-media",
    },
  ],
});
