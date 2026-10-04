import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "packingplanner",
    "compatibilityDate": "2026-10-01",
    "observability": {
      "enabled": true
    }
  }
});
