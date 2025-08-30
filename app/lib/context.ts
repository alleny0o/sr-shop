import { createCustomerAccountClient, createHydrogenContext } from '@shopify/hydrogen';
import { AppSession } from '~/lib/session';
import { CART_QUERY_FRAGMENT } from '~/graphql/storefront/fragments/cart';
import { createS3Client } from '~/lib/s3'; // Add this import
import { createRekognitionClient } from './rekognition';

export async function createAppLoadContext(request: Request, env: Env, executionContext: ExecutionContext) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([caches.open('hydrogen'), AppSession.init(request, [env.SESSION_SECRET])]);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  // Create S3 client
  const s3Client = createS3Client(env);

  // Create rekognition client
  const rekognitionClient = createRekognitionClient(env);

  return {
    ...hydrogenContext,
    s3Client,
    rekognitionClient,
  };
}
