import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./src/server/routes";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "DS44 Compliance OS", timestamp: new Date().toISOString() });
  });
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/health/ready", (_req, res) => {
    res.json({ status: "ready" });
  });

  // API routes mounted FIRST
  app.use("/api", apiRouter);

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DS44 Compliance OS] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
