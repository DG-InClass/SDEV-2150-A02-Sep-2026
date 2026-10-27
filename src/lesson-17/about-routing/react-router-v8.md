---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section { font-size: 29px; }
  section.lead { background: #152238; color: white; }
  section.lead h1, section.lead h2 { color: #7dd3fc; }
  section code { font-size: 0.8em; }
  section pre { font-size: 0.75em; }
  table { font-size: 0.72em; }
---
<!-- _class: lead -->
# Routing in React
## From URLs to React Router v8

---
# Learning goals

- Explain **what routing does** in a web application
- Contrast **document navigation** with **client-side navigation**
- Identify current routing choices in the React ecosystem
- Recognize essential React Router APIs
- Choose between **Declarative**, **Data**, and **Framework** modes

---
# What is a route?

A **route** maps a URL (or URL pattern) to an application response.

| URL | What the user expects |
|---|---|
| `/` | Home |
| `/products` | Product list |
| `/products/42` | Product details for #42 |
| `/about` | About page |

**Routing** is the process of matching and handling those URLs.

---
# Why do we need routing?

Imagine an app with **Home**, **Products**, and **Cart**.

Without URL-aware routing:
- The app might show different screens using only local state
- Refreshing could lose the current screen
- Users cannot reliably bookmark or share a screen
- Browser Back/Forward may not behave as expected

**A URL should identify where the user is in the app.**

---
# Traditional document navigation

```text
Click link → browser requests /products
           → server responds with HTML
           → browser loads a new document
```

- The server decides what document to return
- Navigation typically reloads the page
- URLs naturally identify documents/resources

**This model still works—and is often a good choice.**

---
# Client-side navigation in an SPA

```text
Click <Link> → browser history URL changes
             → router matches new URL
             → React renders matching UI
```

- Usually no full-document reload for internal navigation
- React can preserve shared layout and state
- Initial page load and refresh still require server support

**Routing is not the same thing as rendering or fetching data.**

---
# The browser still matters

A client-side router cooperates with browser features:

- **Address bar:** meaningful URLs
- **History API:** Back / Forward / navigation entries
- **Direct links:** open `/products/42` in a new tab
- **Refresh:** hosting server must serve the app entry point for client routes

> A working `<Link>` does **not** guarantee that refreshing a nested URL works on your deployed server.

---
# React itself does not prescribe routing

React renders components. A router coordinates **URL ↔ UI**.

Modern options include:

| Choice | Typical fit |
|---|---|
| **React Router v8** | General routing; library or full framework |
| **TanStack Router** | Strong TypeScript-first routing and search params |
| **Next.js App Router** | Full-stack React framework with integrated routing |
| **TanStack Start** | Full-stack framework built on TanStack Router |
| **Wouter** | Lightweight client-side routing |

Framework routers are generally chosen **with the framework**, not dropped into any existing Vite app.

---
<!-- _class: lead -->
# Focus: React Router v8
## One router, three modes

---
# What does React Router provide?

- Match URL patterns to React components
- Navigate with links and code
- Read URL parameters and query strings
- Compose nested routes and shared layouts
- Optionally coordinate loading, mutations, and pending UI
- Optionally provide full application framework tooling

**The features depend on the mode you choose.**

---
# The URL has several useful parts

```text
https://example.com/products/42?tab=reviews#details
                   └── path ──┘ └─ search ┘ └ hash ┘
```

- **Path parameter:** `/products/:productId` matches `42`
- **Search parameter:** `?tab=reviews` represents URL-based state
- **Hash:** `#details` identifies a fragment

These are different concerns, even when used on one page.

---
# Declarative example: route → component

```jsx
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

The router selects the matching route element.

---
# Navigate with links

```jsx
import { Link, NavLink } from "react-router";

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink to="/products">Products</NavLink>
    </nav>
  );
}
```

- `<Link>` navigates within the app
- `<NavLink>` also exposes active/pending information (as supported by mode)
- Prefer links for ordinary user navigation; use `useNavigate()` for imperative cases

---
# Nested routes share a layout

```jsx
<Routes>
  <Route element={<SiteLayout />}>
    <Route index element={<Home />} />
    <Route path="products" element={<Products />} />
    <Route path="products/:id" element={<Product />} />
  </Route>
</Routes>
```

```jsx
import { Outlet } from "react-router";
function SiteLayout() {
  return <><Header /><main><Outlet /></main></>;
}
```

`<Outlet />` is where a matching child route renders.

---
# Read dynamic route parameters

```jsx
import { useParams, useSearchParams } from "react-router";

function Product() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "overview";

  return <h1>Product {id} — {tab}</h1>;
}
```

For `/products/42?tab=reviews`:

- `id` is `"42"` (a **string**, not a number)
- `tab` is `"reviews"`

---
# Where should data loading happen?

**Declarative mode:** Your components or a separate data library manage fetching, loading, and errors.

**Data mode:** Route `loader` functions can load data before the destination renders; `action` functions can handle submissions.

**Framework mode:** Adds route modules and build/runtime conventions around those data features.

> A router and a data-fetching library can complement each other.

---
<!-- _class: lead -->
# Three modes
## Declarative → Data → Framework

---
# The modes are additive

```text
Declarative
  URL matching + navigation + nested routes
       ↓ adds
Data
  loaders + actions + navigation/pending state
       ↓ adds
Framework
  route modules + Vite tooling + rendering strategies
```

More features generally mean **more conventions and less architectural control**.

---
# Mode 1: Declarative

```jsx
import { BrowserRouter, Routes, Route } from "react-router";

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
  </Routes>
</BrowserRouter>
```

**Choose it when:**
- You want the simplest route-to-component mapping
- Your existing app already has a data-fetching strategy
- You want to teach or learn routing fundamentals independently

---
# Mode 2: Data

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/products",
    Component: Products,
    loader: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Load failed");
      return response.json();
    },
  },
]);

<RouterProvider router={router} />;
```

Route configuration lives **outside React rendering**.

---
# Data mode: consume loaded data

```jsx
import { useLoaderData } from "react-router";

function Products() {
  const products = useLoaderData();
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

- Loaders connect data requirements to routes
- Actions handle route-oriented mutations
- Router APIs expose navigation and submission state

**Choose it when:** you want these features while retaining your own Vite/build/server architecture.

---
# Mode 3: Framework

Routes are configured using framework conventions:

```ts
// app/routes.ts
import { index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("products/:id", "./routes/product.tsx"),
];
```

Route modules can export loaders, actions, metadata, and components.

**Choose it when:** you want integrated tooling, type-safe route APIs, code splitting, and SPA/SSR/static-rendering options.

---
# Compare the three modes

| Question | Declarative | Data | Framework |
|---|---|---|---|
| URL matching / links | ✓ | ✓ | ✓ |
| Nested layouts | ✓ | ✓ | ✓ |
| Route loaders/actions | — | ✓ | ✓ |
| Built-in pending states | Limited | ✓ | ✓ |
| Route modules / Vite integration | — | — | ✓ |
| SSR / static strategies | DIY | DIY | Integrated |
| Architectural freedom | Most | High | More conventions |

**Modes are not synonyms for CSR, SSR, and SSG.**

---
# Choose a mode: three scenarios

**A.** Existing Vite SPA, already using TanStack Query, needs URL navigation.

→ **Declarative** is a reasonable choice.

**B.** Existing Vite SPA, wants route-based loaders, actions, and pending UI.

→ **Data** is a strong fit.

**C.** New application, wants route modules, generated types, and optional SSR.

→ **Framework** is a strong fit.

---
# Common misconceptions

- **“React includes routing.”** No; React does not prescribe it.
- **“SPA means one URL.”** No; one document can support many URLs.
- **“Client-side routing needs no server setup.”** Refresh/deep links still matter.
- **“Data mode means server-side rendering.”** No; data APIs and rendering strategy differ.
- **“Framework mode always requires SSR.”** No; it supports SPA and static strategies too.
- **“React Router v8 needs `react-router-dom`.** Use `react-router` for new v8 apps.

---
# Check your understanding

1. Why is changing local component state **not equivalent** to routing?
2. What should happen if a user refreshes `/products/42`?
3. Why use `<Link>` instead of an ordinary `<a>` for internal SPA navigation?
4. What extra responsibilities do loaders and actions address?
5. Which mode would you choose for a Vite app with its own data layer—and why?

---
# Further reading

- [React Router v8 documentation](https://reactrouter.com/home)
- [Picking a mode](https://reactrouter.com/start/modes)
- [Declarative mode](https://reactrouter.com/start/declarative/installation)
- [Data mode](https://reactrouter.com/start/data/installation)
- [Framework mode](https://reactrouter.com/start/framework/installation)
- [React: Creating a React app](https://react.dev/learn/creating-a-react-app)

**Key idea:** Choose the mode based on how much routing infrastructure you want React Router to manage.
