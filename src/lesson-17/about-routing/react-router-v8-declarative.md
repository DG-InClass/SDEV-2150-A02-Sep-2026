---
marp: true
theme: default
paginate: true
size: 16:9
header: 'React Router v8 · Declarative Mode'
style: |
  section { font-size: 27px; }
  section.lead { background: #10263c; color: #f7fafc; }
  section.lead h1 { color: #7dd3fc; }
  h1, h2 { color: #145b88; }
  pre { font-size: 0.76em; }
  code { font-size: 0.9em; }
  table { font-size: 0.72em; }
  blockquote { border-left: 5px solid #0ea5e9; }
---
<!-- _class: lead -->
# React Router v8
## 1 · Declarative Mode

**URL → component** · Navigation · Nested layouts

---
# Learning goals

By the end, you should be able to:

- Explain what a client-side router does
- Register routes with `<Routes>` and `<Route>`
- Navigate with `<Link>` and `<NavLink>`
- Work with URL parameters and nested layouts
- Recognize when Declarative mode is enough

---
# The problem: one app, several views

```text
/                    → Home
/about               → About
/products            → Product list
/products/42         → Product details
```

The browser URL should tell us **which view to show**.

React alone does not provide this URL-to-component mapping.

---
# Declarative mode in one picture

```text
Browser URL
     │
     ▼
<BrowserRouter>
     │
     ▼
<Routes> finds the best matching <Route>
     │
     ▼
React component renders
```

The router handles location, matching, history, and navigation. You control component rendering and data fetching.

---
# Start from a Vite React project

```bash
pnpm create vite my-shop --template react
cd my-shop
pnpm install
pnpm add react-router
pnpm dev
```

**Package:** `react-router`

Import the current APIs from `react-router`, rather than copying older `react-router-dom` tutorial imports.

---
# Step 1 · Put the router around the app

**src/main.jsx**

```jsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

`<BrowserRouter>` keeps React Router synchronized with the browser URL and history.

---
# Step 2 · Map URLs to pages

**src/App.jsx**

```jsx
import { Routes, Route } from "react-router";

function Home() { return <h1>Home</h1>; }
function About() { return <h1>About</h1>; }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  );
}
```

Each `<Route>` pairs a **path pattern** with rendered content.

---
# Step 3 · Navigation without a full document reload

```jsx
import { Link, NavLink } from "react-router";

function SiteNav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink to="/about">
        {({ isActive }) => isActive ? "✓ About" : "About"}
      </NavLink>
    </nav>
  );
}
```

- `<Link>` is for normal navigation
- `<NavLink>` adds active-link awareness
- Prefer these to `<a href="/about">` for internal SPA navigation

---
# Dynamic routes: URL parameters

```jsx
<Route path="/products/:productId"
       element={<ProductDetails />} />
```

```jsx
import { useParams } from "react-router";

function ProductDetails() {
  const { productId } = useParams();
  return <h1>Product #{productId}</h1>;
}
```

`/products/42` ⇒ `productId === "42"`

**Important:** URL parameters are strings. Validate them before using them as identifiers.

---
# Nested routes: shared page layout

```jsx
import { Outlet, Route, Routes } from "react-router";

function Layout() {
  return <><header>My Shop</header><main><Outlet /></main></>;
}

<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="products/:productId" element={<ProductDetails />} />
  </Route>
</Routes>
```

`<Outlet />` marks where the matched child route appears.

---
# Navigation from code

```jsx
import { useNavigate } from "react-router";

function ReturnHomeButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/")}>Home</button>;
}
```

Use `useNavigate()` for navigation triggered by code (for example, after completing a workflow).

Prefer `<Link>` when the user is simply following a link.

---
# What about fetching data?

```jsx
import { useEffect, useState } from "react";

function ProductList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { signal: controller.signal })
      .then((r) => { if (!r.ok) throw Error(r.status); return r.json(); })
      .then(setItems)
      .catch((e) => { if (e.name !== "AbortError") console.error(e); });
    return () => controller.abort();
  }, []);

  return <ul>{items.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

Declarative routing does **not** supply route loaders or actions. Manage loading/error states yourself or use a data library.

---
# Browser history and deployment

- Browser Back/Forward works through the History API
- Deep linking means `/products/42` should open directly
- **Production host:** configure a fallback to `index.html` for app routes; real assets/API routes must still be served normally
- On a project-site subpath, configure `basename` appropriately

Routing in the browser does not eliminate the web server!

---
# When should you choose Declarative?

**Good fit:**

- Small React SPAs and routing fundamentals
- Existing apps with their own fetching/cache architecture
- Projects where you want maximum control over how data is handled

**Consider Data mode when:**

- Loading, mutation, pending, and revalidation are tied closely to routes

---
# Try it yourself

Starting with Home and About:

1. Add a `/products` route and navigation link
2. Add `/products/:productId` and display the ID
3. Move the header into a parent route with `<Outlet />`
4. Test Back/Forward and opening a deep link directly

**Exit ticket:** What does `<BrowserRouter>` do that `<Routes>` does not?

---
# References

- https://reactrouter.com/start/modes
- https://reactrouter.com/start/declarative/installation
- https://reactrouter.com/start/declarative/routing

*Next: Data Mode — route-aware loading and mutations.*
