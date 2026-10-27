---
marp: true
theme: default
paginate: true
size: 16:9
header: 'React Router v8 · Framework Mode'
style: |
  section { font-size: 27px; }
  section.lead { background: #10263c; color: #f7fafc; }
  section.lead h1 { color: #7dd3fc; }
  h1, h2 { color: #145b88; }
  pre { font-size: 0.74em; }
  code { font-size: 0.9em; }
  table { font-size: 0.72em; }
---
<!-- _class: lead -->
# React Router v8
## 3 · Framework Mode

**Route modules · Typed APIs · Flexible rendering**

---
# Learning goals

- Explain what Framework mode adds to Data mode
- Recognize the React Router project structure
- Configure routes with `app/routes.ts`
- Write a route module with a typed loader and component
- Distinguish client-side, server-side, and static rendering
- Know when framework conventions are valuable

---
# Same routes, more infrastructure provided

```text
Declarative  URL → component
     +
Data         route loaders / actions / pending UI
     +
Framework    Vite integration / route modules /
             generated types / rendering strategies
```

The modes are **additive**, not three incompatible libraries.

Framework mode automates more of the application architecture.

---
# When "framework" means more than a router

Framework mode offers:

- A Vite-based toolchain and route configuration
- Route modules, generated types, and code splitting
- Data APIs with server/client execution options
- SPA, server-side rendering (SSR), and pre-rendering possibilities

**Trade-off:** More conventions and tooling; less freedom to design every integration yourself.

---
# Start a new framework application

```bash
pnpm create react-router@latest my-shop
cd my-shop
pnpm install
pnpm dev
```

Scaffold a **React Router framework application** rather than manually adding `<BrowserRouter>` to a plain Vite app.

The generated project contains the supporting Vite and React Router configuration.

---
# The files to recognize

```text
my-shop/
├── app/
│   ├── root.tsx       # root document/layout
│   ├── routes.ts      # route definitions
│   └── routes/
│       ├── home.tsx
│       ├── products.tsx
│       └── product.tsx
├── react-router.config.ts
├── vite.config.ts
└── package.json
```

Exact starter-template files may vary. **`app/routes.ts`** and **route modules** are the key idea.

---
# Step 1 · Route configuration

**app/routes.ts**

```tsx
import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("products", "./routes/products.tsx"),
  route("products/:productId", "./routes/product.tsx"),
] satisfies RouteConfig;
```

A route pairs a **URL pattern** with a **module file**.

This is explicit route configuration; file-convention routing is optional, not required.

---
# Step 2 · Route modules hold page behavior

**app/routes/products.tsx**

```tsx
import type { Route } from "./+types/products";

export async function loader() {
  return { products: [
    { id: "1", name: "Pen" },
    { id: "2", name: "Notebook" },
  ] };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return <ul>{loaderData.products.map((product) =>
    <li key={product.id}>{product.name}</li>
  )}</ul>;
}
```

The framework generates `+types` based on routes and module exports.

---
# Typed dynamic params

**app/routes/product.tsx**

```tsx
import type { Route } from "./+types/product";

export async function loader({ params }: Route.LoaderArgs) {
  return { id: params.productId };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  return <h1>Product {loaderData.id}</h1>;
}
```

The generated types help connect route patterns, loader data, and component props.

**But:** a typed URL parameter is still untrusted user input; validate it.

---
# Where does a loader run?

**Framework mode with server rendering:**

```text
Browser requests /products
         │
         ▼
       Server
    route loader
         │
         ▼
HTML / route data → browser UI
```

A server `loader` may safely use server-only credentials, **if** they remain on the server and never get returned to the client.

A `clientLoader` is a separate API for running loading logic in the browser.

---
# Data mutations through a route action

**app/routes/products.tsx** *(conceptual fragment)*

```tsx
import { Form } from "react-router";
import type { Route } from "./+types/products";

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();
  const name = String(data.get("name") ?? "").trim();
  // Validate, authorize, then write through a server data layer.
  return { saved: Boolean(name) }; // demonstration only
}

export default function Products() {
  return <Form method="post">
    <input name="name" required />
    <button>Add product</button>
  </Form>;
}
```

In server-enabled Framework mode, `action` can execute on the server. The snippet omits persistence intentionally.

---
# Rendering is a separate decision

| Strategy | First page | Typical host |
|---|---|---|
| SPA | Client builds UI | Static host |
| SSR | Server renders request | Server/SSR platform |
| Pre-render | Build produces chosen pages | Static host/CDN |

**Framework mode ≠ always SSR.**

The framework supports different delivery architectures; choose based on deployment, data, SEO, and app needs.

---
# Static hosting: an important caveat

You can deploy a Framework-mode app as a **SPA** to a static host, using framework configuration such as:

```ts
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
} satisfies Config;
```

With `ssr: false`, do **not** assume server loaders/actions can run at request time. Use browser-side APIs/backends appropriately or arrange pre-rendering where supported.

---
# Framework vs Data mode

| Question | Data mode | Framework mode |
|---|---|---|
| Vite integration | You own it | Framework plugin |
| Route config | Route objects | `app/routes.ts` |
| Typed route-module props | Manual | Generated |
| SSR possible? | With custom integration | Built-in pathways |
| Architectural control | More | More convention |

**Neither mode is automatically "better."** Fit matters.

---
# When choose Framework mode?

**Strong fit when:**

- Starting a new, substantial React app
- Wanting integrated loaders/actions with framework conventions
- Considering SSR or pre-rendering
- Appreciating generated route types and automatic code splitting

**Consider Data mode when:** You already own a Vite/hosting stack and want to preserve that control.

---
# Classroom challenge

1. Create a framework app with the CLI
2. Add `/products` and `/products/:productId` routes
3. Return example data from a typed loader
4. Add a form and explain where its action runs
5. Compare SPA and SSR deployment targets

**Exit ticket:** Why is Framework mode not synonymous with SSR?

---
# References

- https://reactrouter.com/start/modes
- https://reactrouter.com/start/framework/installation
- https://reactrouter.com/start/framework/routing
- https://reactrouter.com/start/framework/route-module

*Final question: Which React Router mode would you choose for your next app, and why?*
