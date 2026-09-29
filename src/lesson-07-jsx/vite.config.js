// vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
    oxc: {
        jsx: {
            runtime: 'classic',
            pragma: 'h', // This will be our factory function
        },
    },
});
