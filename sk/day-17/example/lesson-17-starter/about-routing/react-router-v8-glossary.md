---
marp: true
theme: default
paginate: true
size: 16:9
header: 'React Router v8 · Terminology & Abbreviations'
style: |
  section { font-size: 27px; }
  section.lead { background: #10263c; color: #f7fafc; }
  section.lead h1 { color: #7dd3fc; }
  h1, h2 { color: #145b88; }
  strong { color: #12628b; }
  section.lead strong { color: #7dd3fc; }
  code { font-size: 0.88em; }
  pre { font-size: 0.76em; }
  table { font-size: 0.74em; }
  blockquote { border-left: 5px solid #0ea5e9; padding-left: 0.6em; }
---
<!-- _class: lead -->
# React Router v8
## Terminology & Abbreviations

**A companion glossary** for the introduction and three mode-specific slide decks

---
# How to use this deck

- **Vocabulary first:** learn the basic web and routing language.
- **Then:** learn the React Router components and hooks.
- **Finally:** compare Data and Framework mode terminology.

A **glossary** defines terms. It is not a substitute for writing and running the code.

---
# URL · URI · Path

| Term | Meaning | Example |
|---|---|---|
| **URL** | Uniform Resource Locator — an address for a resource | `https://site.test/products/42` |
| **URI** | Uniform Resource Identifier — broader term identifying a resource | A URL is a kind of URI |
| **Pathname** | The path portion of a URL | `/products/42` |
| **Origin** | Scheme + hostname + port | `https://site.test` |

**Key idea:** React Router typically matches the **pathname** against route patterns.

---
# Anatomy of a URL

```text
https://site.test/products/42?sort=price#reviews
└──── origin ───┘└── path ──┘ └─ query ┘└fragment┘
```

- **Query string / search parameters:** values after `?`, e.g. `sort=price`
- **Fragment / hash:** value after `#`, e.g. `reviews`
- **Route parameter:** a value in the path, such as `42` matching `:productId`

**Do not confuse:** `:productId` is a *route pattern*; `42` is the *actual value*.

---
# Route · Router · Routing

- **Route:** a rule connecting a URL pattern with application behavior or UI.
- **Router:** the software that matches locations and coordinates navigation.
- **Routing:** the overall process of choosing what to show or run for a location.
- **Route matching:** deciding which route definition matches the URL.

```text
/products/42  →  products/:productId  →  <Product />
   actual URL        route pattern         UI
```

---
# Navigation · Browser history

- **Navigation:** moving from one application location to another.
- **History stack:** the browser's record of visited locations, used by Back and Forward.
- **Client-side navigation:** updating the displayed UI and browser location without loading a completely new HTML document for every route change.
- **Full document navigation:** asking the browser to load a new document.

**Important:** changing the URL and fetching data are related, but not the same operation.

---
# SPA · MPA

| Abbreviation | Meaning | Typical behavior |
|---|---|---|
| **SPA** | Single-Page Application | Browser runs an app that updates views during navigation |
| **MPA** | Multi-Page Application | Navigation commonly retrieves another HTML document |

**SPA does not mean** there is only one screen or one URL.

A SPA can contain dozens of routes.

---
# CSR · SSR · SSG

| Term | Expansion | Where/when HTML is produced |
|---|---|---|
| **CSR** | Client-Side Rendering | Browser executes JavaScript to render UI |
| **SSR** | Server-Side Rendering | Server renders HTML for a request |
| **SSG** | Static Site Generation | HTML is generated ahead of time, often at build time |

**Pre-rendering** means creating HTML *before* a user requests the page.

**Note:** a page can use SSR or SSG initially and still navigate on the client later.

---
# Hydration · Bundle · Code splitting

- **Hydration:** React attaches interactive behavior to HTML that was already rendered.
- **Bundle:** JavaScript (and related assets) produced for delivery to the browser.
- **Code splitting:** dividing code into separately loadable chunks.
- **Lazy loading:** deferring a chunk or resource until it is needed.

**Why it matters:** Framework mode can integrate route-aware code splitting and initial rendering strategies.

---
# Declarative vs imperative

**Declarative:** describe *what* navigation should be available.

```jsx
<Link to="/products">Products</Link>
```

**Imperative:** explicitly tell the application *to navigate now*.

```jsx
const navigate = useNavigate();
navigate("/products");
```

Both are valid. Prefer links for ordinary user navigation.

---
# React Router's three modes

| Mode | Primary idea |
|---|---|
| **Declarative** | Map URLs to React UI and navigate between routes |
| **Data** | Add route-managed loading, mutations, and pending/error states |
| **Framework** | Add integrated tooling, route modules, types, and rendering options |

**Additive:** each successive mode supplies capabilities on top of earlier concepts.

A **mode is not a rendering strategy**: Framework mode is not synonymous with SSR.

---
# Declarative API vocabulary (1/2)

| API | Definition |
|---|---|
| `<BrowserRouter>` | Router that uses the browser's History API |
| `<Routes>` | Finds and renders the matching route branch |
| `<Route>` | Describes a URL pattern and its UI |
| `<Link>` | Internal navigation link without ordinary full-page reload |
| `<NavLink>` | Link that exposes active (and sometimes pending) state |

**API:** Application Programming Interface — the functions, components, and contracts a library exposes.

---
# Declarative API vocabulary (2/2)

| API | Definition |
|---|---|
| `<Outlet>` | Where a matched child route renders inside a parent |
| `useNavigate()` | Hook for programmatic navigation |
| `useParams()` | Hook to read dynamic path parameters |
| `useLocation()` | Hook to read current router location |
| `useSearchParams()` | Hook to read/update URL query parameters |

A **hook** is a React function, typically named `use...`, that accesses React or library behavior in a component.

---
# Nested route · Layout route · Index route

- **Nested route:** a child route placed under a parent route.
- **Layout route:** a route that supplies shared UI for children (often with `<Outlet>`).
- **Index route:** the default child rendered when the parent URL matches exactly.

```text
/                 → Layout + Home (index)
/products         → Layout + Products
/products/42      → Layout + Product
```

**Think:** the parent renders the frame; the matched child fills the outlet.

---
# Dynamic segment · Route parameter

A **dynamic segment** is a placeholder in a route pattern, identified by `:`.

```text
Route pattern: /products/:productId
Actual URL:    /products/42
Parameter:     productId = "42"
```

```jsx
const { productId } = useParams();
```

- Parameters arrive as **strings** when present.
- Treat URL-derived values as **untrusted input**; validate before use.

---
# Data Mode: router configuration

| Term | Meaning |
|---|---|
| **Route object** | JavaScript object declaring route path, component, loader, etc. |
| `createBrowserRouter()` | Creates a browser data router from route definitions |
| `<RouterProvider>` | Makes that data router available to the React app |
| **Route configuration** | The collected declarations that describe the route tree |

**Distinction:** Data mode creates the router *outside* React rendering and passes it to a provider.

---
# Loader · Loader data

- **Loader:** function associated with a route that obtains data needed by that route.
- **Loader data:** value returned by a loader and made available to the page.
- `useLoaderData()`: hook used to read the current route's loader result in Data mode.

```text
Navigation → matched loader → data → component
```

**Execution matters:** loaders of a `createBrowserRouter()` app run in the **browser**, not automatically on a server.

---
# Action · Mutation · Form

- **Mutation:** an operation that changes data (create, update, delete).
- **Action:** a route function that handles a mutation/submission.
- `<Form>`: React Router's form integration that submits to route actions in Data/Framework modes.
- **GET / POST:** HTTP methods commonly used to read / submit data, respectively.

```text
<Form method="post"> → route action → data changes
```

**Warning:** an action is not automatically a secured server endpoint.

---
# Pending · Revalidation · Error boundary

- **Pending state:** navigation or submission has started but is not complete.
- `useNavigation()`: reports navigation/submission state such as `idle`, `loading`, or `submitting`.
- **Revalidation:** running loaders again to refresh data after certain events, such as a completed action.
- **Error boundary:** route-level UI that handles errors instead of leaving the app with no useful screen.

**Think:** route success, work-in-progress, and failure each need a UI.

---
# Framework · Toolchain · Convention

- **Framework:** integrated structure and tooling for building an application, beyond an isolated library API.
- **Toolchain:** the build/dev tools used to compile, run, and package the app.
- **Convention:** an agreed project layout or pattern the framework recognizes.
- **Vite:** development server and build tool used by React Router Framework mode.
- **CLI:** Command-Line Interface — commands run in a terminal (e.g. `pnpm dev`).

---
# Route module · Generated types

- **Route module:** a source file exporting route behavior, such as a component, loader, or action.
- **Generated types:** TypeScript definitions created from the project's route configuration and exports.
- **Type safety:** tooling checks whether values match their declared types.
- **Props:** inputs passed to a React component.

```text
app/routes.ts → route module → generated +types → typed props
```

Type safety does **not** replace runtime validation of user input.

---
# Server loader vs client loader

| API in Framework mode | Runs where? |
|---|---|
| `loader` | Server (when server execution is available) |
| `clientLoader` | Browser |
| `action` | Server (when server execution is available) |
| `clientAction` | Browser |

In a **Data mode** browser router, ordinary route `loader` and `action` functions execute in the browser.

**Ask:** Where is this code executed? That determines which resources and secrets it may access.

---
# Runtime · Build time · Deployment

- **Runtime:** when the running application handles user requests/interactions.
- **Build time:** when source code is compiled and assets/pages are generated.
- **Deployment:** publishing the built application to a hosting environment.
- **Static host:** serves prebuilt files rather than running app server code per request.
- **CDN:** Content Delivery Network — geographically distributed delivery of assets.

**Static hosting consideration:** a client-side route such as `/products/42` may need a fallback to `index.html`.

---
# HTTP · API · JSON · Fetch

| Term | Meaning |
|---|---|
| **HTTP** | Hypertext Transfer Protocol — web request/response protocol |
| **API endpoint** | Address that provides data or an operation |
| **JSON** | JavaScript Object Notation — common data exchange format |
| `fetch()` | Browser/Web API for making HTTP requests |
| **Response** | Data/status returned from a request |

**Do not confuse:** a React Router *route* renders UI; an API *endpoint* provides an HTTP service (though server frameworks can also expose routes that return data).

---
# Common misconceptions

| Incorrect shortcut | Better understanding |
|---|---|
| “A SPA has one route.” | It can have many URLs and views. |
| “A loader always runs on a server.” | It depends on the mode and runtime. |
| “Framework mode requires SSR.” | It supports SPA, SSR, and pre-rendering. |
| “TypeScript validates URL input.” | Types don't validate values at runtime. |
| “A Link is just an anchor with styling.” | It integrates with router navigation. |

---
# Check your understanding

1. What is the difference between a **route pattern** and a **URL**?
2. How does **CSR** differ from **SSR** and **SSG**?
3. When do you use `<Outlet>`?
4. What is the difference between a **loader** and an **action**?
5. Where does a Data mode loader run in a `createBrowserRouter` app?
6. Why is **Framework mode ≠ SSR**?

---
# Quick-reference: abbreviations

| Web / architecture | React / tooling |
|---|---|
| URL — Uniform Resource Locator | API — Application Programming Interface |
| URI — Uniform Resource Identifier | CLI — Command-Line Interface |
| SPA — Single-Page Application | JSX — JavaScript XML syntax extension |
| MPA — Multi-Page Application | TS / TSX — TypeScript / TypeScript with JSX |
| CSR — Client-Side Rendering | JSON — JavaScript Object Notation |
| SSR — Server-Side Rendering | HTTP — Hypertext Transfer Protocol |
| SSG — Static Site Generation | CDN — Content Delivery Network |

---
# References and next steps

**React Router reference**

- https://reactrouter.com/start/modes
- https://reactrouter.com/start/declarative/routing
- https://reactrouter.com/start/data/data-loading
- https://reactrouter.com/start/data/actions
- https://reactrouter.com/start/framework/route-module
- https://reactrouter.com/how-to/spa

**Suggested exercise:** pick a term from each category and explain it using the `/products/42` example.
