import { createClient } from "@sanity/client";
import createImageUrlBuilder from "@sanity/image-url";

const options = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  useCdn: false, // set to `false` for real-time writes/reads
  apiVersion: "2023-05-03",
};

export const client = createClient({
  ...options,
  useCdn: true,
});

export const writeClient = createClient({
  ...options,
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN, // Add this to your .env
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
