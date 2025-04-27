import * as remixBuild from '@remix-run/dev/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createHydrogenContext,
} from '@shopify/hydrogen';
import {
  createCookieSessionStorage,
  createRequestHandler,
} from '@shopify/remix-oxygen';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // Skip favicon requests
      if (new URL(request.url).pathname === '/favicon.ico') {
        return new Response(null, { status: 404 });
      }

      /**
       * Create a session object using Oxygen's session API.
       */
      const session = createCookieSessionStorage({
        cookie: {
          name: 'session',
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secrets: [env.SESSION_SECRET || 'default-session-secret'],
          secure: process.env.NODE_ENV === 'production',
        },
      });

      /**
       * Create Hydrogen's context.
       * This wraps around the storefront client, customer account client, and cart handler
       * for better performance and type safety.
       */
      const hydrogenContext = createHydrogenContext({
        env,
        request,
        waitUntil: executionContext.waitUntil.bind(executionContext),
        session,
        storefront: {
          buyerIp: request.headers.get('CF-Connecting-IP'),
          i18n: { language: 'EN', country: 'US' },
        },
        cart: {
          getCartId: cartGetIdDefault(request.headers),
          setCartId: cartSetIdDefault(),
        },
        customerAccount: {},
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's context to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        const currentHeaders = Object.fromEntries(response.headers.entries());
        const sessionHeaders = await hydrogenContext.session.commit();

        // Create a new response with the session headers
        return new Response(response.body, {
          status: response.status,
          headers: new Headers({ ...currentHeaders, ...sessionHeaders }),
        });
      }

      return response;
    } catch (error) {
      console.error('Unexpected server error:', error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
};
