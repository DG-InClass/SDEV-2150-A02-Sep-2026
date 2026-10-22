# Backend Server (Resources API)

This server provides CRUD endpoints for resource objects stored in `resources.json`.

## Requirements

- Node.js (ES modules enabled)

## Setup

From the `backend/` folder:

```sh
npm install
```

## Run the server

```sh
npm start
```

The server listens on `http://localhost:3000`.

### Simulate a slow response

Stop the server with Ctrl+C, then restart it with:

```sh
npm run start:slow
```

If using pnpm, run `pnpm run start:slow` instead. This adds a three-second delay to all JSON responses, including errors, so you can observe the frontend loading state. CORS preflight (`OPTIONS`) responses remain immediate.

Stop the server and run `npm start` (or `pnpm start`) to return to normal response times.

### Simulate errors

Stop the server, then restart it with:

```sh
npm run start:errors
```

About half of all requests will fail with a randomly chosen fault. Each fake error is logged in the server terminal (e.g. `[fake error] GET /resources -> 503`). Refresh the frontend a few times to see different failures.

| Fault       | Status | What the frontend receives                                  |
| ----------- | ------ | ----------------------------------------------------------- |
| `401`       | 401    | `{ "error": "Unauthorized: ..." }`                          |
| `403`       | 403    | `{ "error": "Forbidden: ..." }`                             |
| `404`       | 404    | `{ "error": "Endpoint not found" }`                         |
| `500`       | 500    | `{ "error": "Internal server error" }`                      |
| `503`       | 503    | `{ "error": "Service unavailable: ..." }`                   |
| `malformed` | 200    | Truncated, invalid JSON (`response.json()` throws)          |
| `object`    | 200    | `{ "count": 7, "resources": [...] }` instead of an array     |
| `message`   | 200    | `{ "error": true, "message": "Database connection timed out" }` |

To force one specific fault on every request, or change how often faults happen, run the server directly:

```sh
node server.js --errors=malformed
node server.js --errors --error-rate=0.2
```

The flags can be combined with `--slow` (e.g. `node server.js --slow --errors`).

## Data file

Resource data is stored in `resources.json`. The server reads and writes this file on each request.

## Endpoints

### List all resources

```http
GET /resources
```

### Get one resource by id

```http
GET /resources/:id
```

### Create a resource

```http
POST /resources
Content-Type: application/json
```

Example body:

```json
{
  "title": "Peer Tutoring Centre",
  "category": "Academic",
  "summary": "Drop-in tutoring and study support.",
  "location": "Building W, Room W101",
  "hours": "Mon-Thu 10:00-16:00",
  "contact": "tutoring@nait.ca",
  "virtual": false,
  "openNow": true
},
```

### Update a resource

```http
PUT /resources/:id
Content-Type: application/json
```

Body should include all resource fields (the `id` is optional, but if provided must match the URL).

### Delete a resource

```http
DELETE /resources/:id
```

## Resource shape

```js
{
  id: string,
  title: string,
  category: string,
  summary: string,
  location: string,
  hours: string,
  contact: string,
  virtual: boolean,
  openNow: boolean
}
```
