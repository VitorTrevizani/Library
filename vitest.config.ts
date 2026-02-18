import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,        // permite usar describe/it/expect sem importar
    environment: 'node'   // ideal para projetos Node.js
  }
});