// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { CachedCommercifyApiClient } from "$lib/server/api";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      api: CachedCommercifyApiClient;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare module "$env/static/private" {
  export const PRIVATE_API_URL: string;
}

export {};
