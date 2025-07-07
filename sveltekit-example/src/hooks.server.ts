import { createApiClient } from "$lib/server/api";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // Get the auth token from a secure, httpOnly cookie
  const authToken = event.cookies.get("auth_token");

  // Create an API client instance and attach it to the event object
  event.locals.api = createApiClient(event, authToken);

  // Continue processing the request
  const response = await resolve(event);
  return response;
};
