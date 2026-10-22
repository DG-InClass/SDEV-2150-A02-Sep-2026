import http from 'http';
import fs from 'fs';
import url from 'url';
import path from 'path';

// Run with --slow (see start:slow in package.json) to delay JSON responses.
const JSON_DELAY_MS = process.argv.includes('--slow') ? 3000 : 0;

const sendRaw = (res, body) => {
  const send = () => res.end(body);
  if (JSON_DELAY_MS > 0) setTimeout(send, JSON_DELAY_MS);
  else send();
};

const sendJson = (res, payload) => sendRaw(res, JSON.stringify(payload));

const DATA_FILE = path.join(process.cwd(), 'resources.json');
const RESOURCE_FIELDS = [
  'title',
  'category',
  'summary',
  'location',
  'hours',
  'contact',
  'virtual',
  'openNow',
];

const readDatabase = (callback) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return callback(err);
    try {
      const db = JSON.parse(data);
      if (!db.resources || !Array.isArray(db.resources)) {
        return callback(new Error('Invalid database format'));
      }
      callback(null, db);
    } catch (parseErr) {
      callback(parseErr);
    }
  });
};

const writeDatabase = (db, callback) => {
  fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8', callback);
};

const readRequestBody = (req, callback) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    if (!body) return callback(null, null);
    try {
      const data = JSON.parse(body);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
};

const buildResource = (input, id) => {
  const resource = { id };
  RESOURCE_FIELDS.forEach((field) => {
    resource[field] = input[field];
  });
  return resource;
};

const validateResource = (resource, { requireId }) => {
  if (!resource || typeof resource !== 'object') {
    return 'Resource payload must be an object';
  }
  if (requireId && (!resource.id || typeof resource.id !== 'string')) {
    return 'Resource id is required';
  }
  for (const field of RESOURCE_FIELDS) {
    if (resource[field] === undefined) {
      return `Missing required field: ${field}`;
    }
  }
  for (const field of ['title', 'category', 'summary', 'location', 'hours', 'contact']) {
    if (typeof resource[field] !== 'string') {
      return `Field ${field} must be a string`;
    }
  }
  for (const field of ['virtual', 'openNow']) {
    if (typeof resource[field] !== 'boolean') {
      return `Field ${field} must be a boolean`;
    }
  }
  return null;
};

const generateId = () => `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Run with --errors (see start:errors in package.json) to inject fake failures.
//   --errors              about half of requests fail, with a randomly chosen fault
//   --errors=<fault>      every request fails with that fault (e.g. --errors=403)
//   --error-rate=<0..1>   how often random faults happen (default 0.5)
const getArgValue = (name) => {
  const arg = process.argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!arg) return undefined;
  return arg.includes('=') ? arg.split('=')[1] : true;
};

const FAULTS = {
  401: (res) => {
    res.statusCode = 401;
    sendJson(res, { error: 'Unauthorized: missing or invalid credentials' });
  },
  403: (res) => {
    res.statusCode = 403;
    sendJson(res, { error: 'Forbidden: you do not have access to this resource' });
  },
  404: (res) => {
    res.statusCode = 404;
    sendJson(res, { error: 'Endpoint not found' });
  },
  500: (res) => {
    res.statusCode = 500;
    sendJson(res, { error: 'Internal server error' });
  },
  503: (res) => {
    res.statusCode = 503;
    res.setHeader('Retry-After', '10');
    sendJson(res, { error: 'Service unavailable: please try again later' });
  },
  // 200 OK, but the body is not valid JSON (response.json() will throw)
  malformed: (res) => {
    sendRaw(res, '[{"id": "res_1", "title": "Peer Tutoring Centre", "category": ');
  },
  // 200 OK, valid JSON, but an object wrapping the array instead of the array itself
  object: (res) => {
    readDatabase((err, db) => {
      const resources = err ? [] : db.resources;
      sendJson(res, { count: resources.length, resources });
    });
  },
  // 200 OK, valid JSON, but the body is an error message instead of data
  message: (res) => {
    sendJson(res, { error: true, message: 'Database connection timed out' });
  },
};

const errorsArg = getArgValue('errors');
const ERRORS_ENABLED = errorsArg !== undefined;
const FORCED_FAULT = typeof errorsArg === 'string' ? errorsArg : null;
const ERROR_RATE = Number(getArgValue('error-rate') ?? 0.5);

if (FORCED_FAULT && !FAULTS[FORCED_FAULT]) {
  console.error(`Unknown fault "${FORCED_FAULT}". Choose one of: ${Object.keys(FAULTS).join(', ')}`);
  process.exit(1);
}

// Sends a fake fault and returns true, or returns false to let the request through
const maybeInjectFault = (req, res) => {
  if (!ERRORS_ENABLED) return false;
  if (!FORCED_FAULT && Math.random() >= ERROR_RATE) return false;
  const names = Object.keys(FAULTS);
  const fault = FORCED_FAULT ?? names[Math.floor(Math.random() * names.length)];
  console.log(`[fake error] ${req.method} ${req.url} -> ${fault}`);
  FAULTS[fault](res);
  return true;
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Add CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Set JSON response header for all responses
  res.setHeader('Content-Type', 'application/json');

  if (maybeInjectFault(req, res)) return;

  if (pathname === '/resources' && method === 'GET') {
    readDatabase((err, db) => {
      if (err) {
        res.statusCode = 500;
        return sendJson(res, { error: 'Failed to read database' });
      }
      sendJson(res, db.resources);
    });
  } else if (pathname === '/resources' && method === 'POST') {
    readRequestBody(req, (bodyErr, payload) => {
      if (bodyErr) {
        res.statusCode = 400;
        return sendJson(res, { error: 'Invalid JSON body' });
      }
      const payloadId = payload?.id;
      if (payloadId !== undefined && typeof payloadId !== 'string') {
        res.statusCode = 400;
        return sendJson(res, { error: 'Resource id must be a string' });
      }
      const validationError = validateResource(payload, { requireId: false });
      if (validationError) {
        res.statusCode = 400;
        return sendJson(res, { error: validationError });
      }
      readDatabase((err, db) => {
        if (err) {
          res.statusCode = 500;
          return sendJson(res, { error: 'Failed to read database' });
        }
        const newId = payloadId || generateId();
        if (db.resources.some((resource) => resource.id === newId)) {
          res.statusCode = 409;
          return sendJson(res, { error: `Resource ${newId} already exists` });
        }
        const resource = buildResource(payload, newId);
        db.resources.push(resource);
        writeDatabase(db, (writeErr) => {
          if (writeErr) {
            res.statusCode = 500;
            return sendJson(res, { error: 'Failed to write database' });
          }
          res.statusCode = 201;
          sendJson(res, resource);
        });
      });
    });
  } else if (pathname.startsWith('/resources/') && method === 'GET') {
    const match = pathname.match(/^\/resources\/([^/]+)$/);
    if (!match) {
      res.statusCode = 404;
      return sendJson(res, { error: 'Endpoint not found' });
    }
    const resourceId = decodeURIComponent(match[1]);
    readDatabase((err, db) => {
      if (err) {
        res.statusCode = 500;
        return sendJson(res, { error: 'Failed to read database' });
      }
      const resource = db.resources.find((entry) => entry.id === resourceId);
      if (!resource) {
        res.statusCode = 404;
        return sendJson(res, { error: `Resource ${resourceId} not found` });
      }
      sendJson(res, resource);
    });
  } else if (pathname.startsWith('/resources/') && method === 'PUT') {
    const match = pathname.match(/^\/resources\/([^/]+)$/);
    if (!match) {
      res.statusCode = 404;
      return sendJson(res, { error: 'Endpoint not found' });
    }
    const resourceId = decodeURIComponent(match[1]);
    readRequestBody(req, (bodyErr, payload) => {
      if (bodyErr) {
        res.statusCode = 400;
        return sendJson(res, { error: 'Invalid JSON body' });
      }
      if (payload?.id !== undefined && payload.id !== resourceId) {
        res.statusCode = 400;
        return sendJson(res, { error: 'Resource id cannot be changed' });
      }
      const validationError = validateResource({ ...payload, id: resourceId }, { requireId: true });
      if (validationError) {
        res.statusCode = 400;
        return sendJson(res, { error: validationError });
      }
      readDatabase((err, db) => {
        if (err) {
          res.statusCode = 500;
          return sendJson(res, { error: 'Failed to read database' });
        }
        const index = db.resources.findIndex((entry) => entry.id === resourceId);
        if (index === -1) {
          res.statusCode = 404;
          return sendJson(res, { error: `Resource ${resourceId} not found` });
        }
        const resource = buildResource(payload, resourceId);
        db.resources[index] = resource;
        writeDatabase(db, (writeErr) => {
          if (writeErr) {
            res.statusCode = 500;
            return sendJson(res, { error: 'Failed to write database' });
          }
          sendJson(res, resource);
        });
      });
    });
  } else if (pathname.startsWith('/resources/') && method === 'DELETE') {
    const match = pathname.match(/^\/resources\/([^/]+)$/);
    if (!match) {
      res.statusCode = 404;
      return sendJson(res, { error: 'Endpoint not found' });
    }
    const resourceId = decodeURIComponent(match[1]);
    readDatabase((err, db) => {
      if (err) {
        res.statusCode = 500;
        return sendJson(res, { error: 'Failed to read database' });
      }
      const index = db.resources.findIndex((entry) => entry.id === resourceId);
      if (index === -1) {
        res.statusCode = 404;
        return sendJson(res, { error: `Resource ${resourceId} not found` });
      }
      const [removed] = db.resources.splice(index, 1);
      writeDatabase(db, (writeErr) => {
        if (writeErr) {
          res.statusCode = 500;
          return sendJson(res, { error: 'Failed to write database' });
        }
        sendJson(res, removed);
      });
    });
  } else {
    res.statusCode = 404;
    sendJson(res, { error: 'Endpoint not found' });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (JSON_DELAY_MS > 0) console.log(`Slow mode: JSON responses delayed by ${JSON_DELAY_MS} ms.`);
  if (FORCED_FAULT) console.log(`Error mode: every request fails with "${FORCED_FAULT}".`);
  else if (ERRORS_ENABLED) console.log(`Error mode: ${Math.round(ERROR_RATE * 100)}% of requests fail with a random fault.`);
});
