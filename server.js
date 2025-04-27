// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  createCookieSessionStorage,
  createRequestHandler,
} from '@shopify/remix-oxygen';

export default {
  async fetch(request, env, context) {
    try {
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          env,
          context,
          // Optional: Access session data from the request
          session: createCookieSessionStorage({
            cookie: {
              name: 'oxygen-session',
              secrets: [env.SESSION_SECRET || 'development-session-secret'],
              secure: process.env.NODE_ENV === 'production',
            },
          }),
        }),
      });

      return await handleRequest(request);
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
