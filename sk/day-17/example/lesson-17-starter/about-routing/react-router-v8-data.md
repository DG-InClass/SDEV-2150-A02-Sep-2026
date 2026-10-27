---
marp: true
theme: default
paginate: true
size: 16:9
header: 'React Router v8 · Data Mode'
style: |
  section { font-size: 27px; }
  section.lead { background: #10263c; color: #f7fafc; }
  section.lead h1 { color: #7dd3fc; }
  h1, h2 { color: #145b88; }
  pre { font-size: 0.75em; }
  code { font-size: 0.9em; }
  table { font-size: 0.72em; }
---
<!-- _class: lead -->
# React Router v8
## 2 · Data Mode

**Routes + loaders + actions + pending states**

---
# Learning goals

- Explain why Data mode separates router configuration from rendering
- Create a router with `createBrowserRouter()`
- Use `loader` and `useLoaderData()`
- Explain `action`, `<Form>`, and revalidation
- Identify pending and error states
- Compare Data and Declarative modes

---
# The upgrade: a route owns more than a page

**Declarative mode**

```text
URL → Route → Component → component-managed fetch
```

**Data mode**

```text
URL → Route config → loader → Component
                         ↑
                  action / revalidation
```

The route definition can describe its data requirements and mutations.

---
# Same example application

```text
/                 Home
/products         Product list (GET data)
/products/42      Product details (GET data)
/products/new     Create a product (POST form)
```

We'll keep the app recognizable while changing **who coordinates data**.

---
# Start with Vite + React Router

```bash
pnpm create vite my-shop --template react
cd my-shop
pnpm install
pnpm add react-router
```

Data mode is still compatible with a normal Vite React app.

No React Router framework plugin is required.

---
# Step 1 · Route objects, created once

**src/router.jsx**

```jsx
import { createBrowserRouter } from "react-router";
import { Layout, Home, Products, Product } from "./pages";

export const router = createBrowserRouter([
  {
    path: "/", Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "products", Component: Products },
      { path: "products/:productId", Component: Product },
    ],
  },
]);
```

Create the router **outside** React rendering, not inside a component on every render.

---
# Step 2 · Render with RouterProvider

**src/main.jsx**

```jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { router } from "./router.jsx";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

Unlike Declarative mode, the top-level API is **`RouterProvider`**, not `<BrowserRouter>`.

Shared layout components still use `<Outlet />`.

---
# Step 3 · A loader runs before route rendering

**src/router.jsx**

```jsx
async function productsLoader({ request }) {
  const response = await fetch("/api/products", {
    signal: request.signal,
  });
  if (!response.ok) throw new Response("Products unavailable", {
    status: response.status,
  });
  return response.json();
}

// Route object:
{
  path: "products",
  Component: Products,
  loader: productsLoader,
}
```

In this **browser-based Data mode setup**, the loader executes in the browser. It is not automatically a secure server endpoint.

---
# Step 4 · Read loader results

**src/pages.jsx**

```jsx
import { useLoaderData } from "react-router";

export function Products() {
  const products = useLoaderData();
  return (
    <ul>
      {products.map((p) => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

Notice: no local `useEffect` is needed just to initiate this route load.

**Question:** What happens when navigating from `/` to `/products`?

---
# Dynamic route data

```jsx
async function productLoader({ params, request }) {
  const response = await fetch(`/api/products/${params.productId}`, {
    signal: request.signal,
  });
  if (!response.ok) throw new Response("Product not found", {
    status: response.status,
  });
  return response.json();
}

// Route object:
{
  path: "products/:productId",
  Component: Product,
  loader: productLoader,
}
```

The router provides both `params` and a `request` with an abort signal.

---
# Mutations: an action handles submission

```jsx
async function createProductAction({ request }) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Name is required" };

  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    signal: request.signal,
  });
  if (!response.ok) throw new Response("Save failed", {
    status: response.status,
  });
  return { ok: true };
}
```

In browser Data mode, an action is client-executed code that can call a backend API.

---
# Connect a Form to an action

```jsx
import { Form, useActionData } from "react-router";

function NewProduct() {
  const result = useActionData();
  return (
    <Form method="post">
      <label>Name <input name="name" /></label>
      <button type="submit">Create</button>
      {result?.error && <p role="alert">{result.error}</p>}
    </Form>
  );
}

// Route: { path: "products/new",
//          Component: NewProduct, action: createProductAction }
```

After a successful action, React Router ordinarily **revalidates active loaders**. Add explicit redirect logic if a different destination is required.

---
# Pending UI with useNavigation

```jsx
import { useNavigation } from "react-router";

function Layout() {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state !== "idle" && <p>Working…</p>}
      <Outlet />
    </>
  );
}
```

States: `idle`, `loading`, `submitting`.

The router coordinates navigation state across your app.

---
# Error boundaries for routes

```jsx
import { useRouteError } from "react-router";

function RouteFailure() {
  const error = useRouteError();
  return <p role="alert">Could not display this page.</p>;
}

// Route object:
{
  path: "products",
  Component: Products,
  loader: productsLoader,
  ErrorBoundary: RouteFailure,
}
```

A thrown error (or response) can be handled by the closest route error boundary.

---
# Model the navigation lifecycle

```text
Click <Link> to /products
       │
       ▼
Router matches route
       │
       ▼
Runs productsLoader ── failure ──→ ErrorBoundary
       │
     success
       ▼
Products reads useLoaderData()
       │
       ▼
Render products
```

Pending indicators can be shown while the loader is executing.

---
# Choosing Data mode

**Choose it when** you want route-aware loading, mutations, revalidation, and pending UI **without handing over your build/deployment architecture**.

**Remember:**

- Routes are objects created outside rendering
- Loaders and actions run in the browser with `createBrowserRouter`
- Your real backend still owns authorization and trusted data writes
- Framework mode adds conventions, generated route types, and rendering strategies

---
# Classroom challenge

1. Move a Declarative app to `createBrowserRouter()`
2. Replace page-level fetch effects with loaders
3. Add a new-product action and `<Form>`
4. Show a pending indicator and route error boundary

**Exit ticket:** How is a route `loader` different from fetching inside `useEffect`?

---
# References

- https://reactrouter.com/start/modes
- https://reactrouter.com/start/data/installation
- https://reactrouter.com/start/data/data-loading
- https://reactrouter.com/start/data/actions

*Next: Framework Mode — route modules, tooling, and rendering strategies.*
