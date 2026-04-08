const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => { raw += chunk; });
        req.on('end', () => {
            if (!raw) return resolve({});
            try {
                resolve(JSON.parse(raw));
            } catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
    });
}

function createResponseHelpers(res) {
    const state = { statusCode: 200, headers: {} };

    return {
        setHeader: (name, value) => {
            state.headers[name] = value;
        },
        status: (code) => {
            state.statusCode = code;
            return this;
        },
        json: (data) => {
            if (!state.headers['Content-Type']) {
                state.headers['Content-Type'] = 'application/json';
            }
            res.writeHead(state.statusCode, state.headers);
            res.end(JSON.stringify(data), 'utf-8');
        },
        end: (value) => {
            if (!state.headers['Content-Type']) {
                state.headers['Content-Type'] = 'text/plain';
            }
            res.writeHead(state.statusCode, state.headers);
            res.end(value, 'utf-8');
        }
    };
}

async function handleApiRequest(parsedUrl, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    const apiPath = parsedUrl.pathname;
    const apiFile = path.join(__dirname, apiPath + '.js');

    if (!fs.existsSync(apiFile)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'API_NOT_FOUND', path: apiPath }));
    }

    try {
        const handler = require(apiFile);
        const body = req.method === 'POST' ? await parseJsonBody(req) : {};
        const fakeReq = {
            method: req.method,
            url: req.url,
            headers: req.headers,
            query: Object.fromEntries(parsedUrl.searchParams.entries()),
            body
        };

        const fakeRes = createResponseHelpers(res);
        await handler(fakeReq, fakeRes);
    } catch (error) {
        console.error('API handler error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'SERVER_ERROR', details: error.message }));
    }
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (parsedUrl.pathname.startsWith('/api/')) {
        return handleApiRequest(parsedUrl, req, res);
    }

    let filePath = '.' + parsedUrl.pathname;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', (error404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404 || '404 Not Found', 'utf-8');
                });
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n', 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
