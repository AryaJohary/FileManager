const fs = require('fs');
const http = require('http');
const path = require('path');
const port = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.write("Error: File not found");
            } else {
                res.write(data);
            }
            res.end();
        });
    } else if (req.method === 'POST' && req.url === '/file-action') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { action, filename, content } = JSON.parse(body);
            const filePath = path.join(__dirname, filename);
            switch (action.toLowerCase()) {
                case 'read':
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: `Read Error: ${err}` }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: `Read successfully`, data }));
                        }
                    });
                    break;
                case 'write':
                    fs.writeFile(filePath, content, (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: `Write Error: ${err}` }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: "Write successful" }));
                        }
                    });
                    break;
                case 'delete':
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: `Deletion Error: ${err}` }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: "Delete successful" }));
                        }
                    });
                    break;
                default:
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Invalid action" }));
                    break;
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(port, (err) => {
    if (err) {
        console.log("Something went wrong");
    } else {
        console.log("Server is listening on port ", port);
    }
});
