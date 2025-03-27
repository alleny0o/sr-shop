import Medusa from "@medusajs/js-sdk";

let MEDUSA_BACKEND_URL = "http://localhost:9000";

if (import.meta.env.VITE_BACKEND_URL) {
  MEDUSA_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
};

export const sdk = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    auth: {
        type: "session",
    },
});