import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contentFilePath = path.resolve(__dirname, 'server_live_content.json')

// Plugin untuk sinkronisasi data antar komputer/perangkat di jaringan lokal
function localContentSyncPlugin() {
  return {
    name: 'local-content-sync',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/site-content' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(contentFilePath)) {
            res.end(fs.readFileSync(contentFilePath, 'utf-8'));
          } else {
            res.end(JSON.stringify({}));
          }
          return;
        }

        if (req.url === '/api/site-content' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(contentFilePath, body, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localContentSyncPlugin(),
  ],
  server: {
    host: true, // Mengizinkan akses dari komputer/perangkat lain di jaringan lokal (LAN/Wi-Fi)
    port: 5173,
    watch: {
      ignored: ['**/server_live_content.json', '**/.liveContent.json'],
    },
  },
  preview: {
    host: true,
    port: 5173,
  },
})
