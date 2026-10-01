# React Intro Notes

## Installing Tailwind

Installing [TailwindCSS]() is a matter of adding the package dependencies and configuring the project to use them.

```ps
pnpm install -D tailwindcss @tailwindcss/vite
```

Edit the Vite Configuration to identify/use Tailwind as a plugin for Vite.

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// TODO: import tailwindcss
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    // TODO: add the tailwindcss plugin
    tailwindcss(),
    ],
});
```

