import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// /api/* 핸들러를 개발 서버에서도 실행 가능하게 마운트한다.
// Vercel 배포 시에는 api/*.js 파일이 자동으로 serverless function으로 배포되므로
// 이 미들웨어는 development 전용으로만 동작한다.
function devApiPlugin() {
  return {
    name: 'aporia-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const pathname = req.url.split('?')[0]
        if (pathname !== '/api/approve-application') return next()
        try {
          const mod = await server.ssrLoadModule('/api/approve-application.js')
          await mod.default(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ ok: false, error: 'dev api error: ' + (err?.message || String(err)) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
})
