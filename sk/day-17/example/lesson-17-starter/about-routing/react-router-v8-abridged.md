---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  section { font-size: 31px; }
  section.lead { background: #152238; color: white; }
  section.lead h1, section.lead h2 { color: #7dd3fc; }
  section pre { font-size: 0.75em; }
  table { font-size: 0.77em; }
---
<!-- _class: lead -->
# Routing in React
## React Router v8 in 5–10 minutes

---
# What is routing?

**Routing connects a URL to the content a user sees.**

| URL | React screen |
|---|---|
| `/` | Home |
| `/products` | Product list |
| `/products/42` | Product details |

A URL makes a screen **linkable, bookmarkable, and revisitable**.

---
# Why does a React app need a router?

Switching components with `useState()` is not enough:

- The address bar may stay unchanged
- Refreshing may lose the selected screen
- Back and Forward may not work as expected
- Users cannot share a direct link to a specific screen

**A router keeps the URL and the UI in sync.**

---
# Traditional vs. client-side navigation

**Traditional document navigation**

`Click → Request HTML → Server responds → New document`

**Client-side navigation (SPA)**

`Click → URL changes → Router matches → React updates UI`

With an SPA, internal links can navigate **without reloading the whole document**.

> Direct navigation or refresh on a nested URL still needs correct hosting configuration.

---
# Routing choices for modern React

| Choice | Typical use |
|---|---|
| **React Router** | Flexible routing; simple SPA to full framework |
| **TanStack Router** | TypeScript-oriented routing and typed search params |
| **Wouter** | Small, minimal SPA router |
| **Next.js App Router** | Routing integrated into a full-stack framework |
| **TanStack Start** | Full-stack framework using TanStack Router |

**Today: React Router v8.**

---
# React Router: the essential idea

```jsx
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Each `<Route>` maps a URL pattern to a React component.

---
# Navigation and URL parameters

```jsx
import { Link, useParams } from "react-router";

function Products() {
  return <Link to="/products/42">See product 42</Link>;
}

function Product() {
  const { id } = useParams();
  return <h1>Product {id}</h1>;
}
```

- `<Link>` performs client-side navigation
- `:id` is a dynamic path segment
- `useParams()` reads its value (as a string)

---
<!-- _class: lead -->
# React Router's three modes
## Same routing foundation; different levels of integration

---
# Modes: what gets added?

| Mode | Adds | Choose when… |
|---|---|---|
| **Declarative** | Routes, links, nested layouts | You want straightforward routing in an existing SPA |
| **Data** | Route loaders, actions, navigation states | You want routing and data operations coordinated |
| **Framework** | Route modules, tooling, rendering options | You want an integrated application framework |

**Additive model:** Declarative → Data → Framework

Framework mode **does not require SSR**; Data mode **does not imply SSR**.

---
# Which mode would you choose?

**Scenario A:** A small Vite/React SPA already fetches its own data.

→ **Declarative**

**Scenario B:** An existing app needs route loaders, form actions, and pending UI.

→ **Data**

**Scenario C:** A new app needs integrated route modules, generated types, and possibly SSR.

→ **Framework**

**Takeaway:** Pick the *least infrastructure* that comfortably fits your app.

---
# One-minute recap

1. **Routing** connects URLs to views.
2. **Client-side routing** navigates without a full page reload.
3. **React** does not include its own router.
4. **React Router v8** has three additive modes:
   - Declarative → Data → Framework

**Question:** What breaks if `/products/42` works through a link, but fails on refresh?

Documentation: https://reactrouter.com/start/modes
