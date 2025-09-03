/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {
  HydrogenContext,
  HydrogenSessionData,
  HydrogenEnv,
} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/lib/context';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  interface Env extends HydrogenEnv {
    // The AWS region where your resources (S3, Rekognition, etc.) are hosted.
    AWS_REGION: string;
  
    // IAM user credentials for the user.
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  
    // The S3 bucket used for storing uploaded assets (e.g. product images).
    S3_BUCKET_NAME: string;
  
    // CloudFront distribution domain used to serve S3 content.
    CLOUDFRONT_DOMAIN: string;
  }
}

declare module 'react-router' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // to change context type, change the return of createAppLoadContext() instead
  }

  // TODO: remove this once we've migrated our loaders to `Route.LoaderArgs` 
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }

  // TODO: remove this once we've migrated our loaders to `Route.ActionArgs`
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}
