import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("/node_modules/@firebase/firestore/") ||
            id.includes("/node_modules/firebase/firestore/")
          )
            return "firebase-firestore";
          if (
            id.includes("/node_modules/@firebase/auth/") ||
            id.includes("/node_modules/firebase/auth/")
          )
            return "firebase-auth";
          if (
            id.includes("/node_modules/@firebase/") ||
            id.includes("/node_modules/firebase/")
          )
            return "firebase-core";
          if (
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react/")
          )
            return "react";
        },
      },
    },
  },
});
