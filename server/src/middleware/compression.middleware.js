import zlib from 'node:zlib';

/**
 * Native Brotli & Gzip compression middleware (zero external dependencies).
 * Mimics Cloudflare's edge compression engine with 'br' preference.
 */
export function edgeCompression(options = {}) {
  const threshold = options.threshold || 512;

  return (req, res, next) => {
    const startTime = process.hrtime.bigint();

    // Attach response time header on finish
    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
      res.setHeader('Server-Timing', `total;dur=${durationMs.toFixed(1)}`);
    });

    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (!acceptEncoding) {
      return next();
    }

    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);

    function compressAndSend(body, isJson = false) {
      if (res.headersSent) {
        return originalSend(body);
      }

      // If Content-Encoding already set, bypass
      if (res.getHeader('Content-Encoding')) {
        return isJson ? originalJson(body) : originalSend(body);
      }

      let payload = body;
      if (isJson || typeof body === 'object') {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        payload = Buffer.from(JSON.stringify(body));
      } else if (typeof body === 'string') {
        payload = Buffer.from(body);
      }

      if (!Buffer.isBuffer(payload) || payload.length < threshold) {
        return originalSend(payload);
      }

      res.setHeader('Vary', 'Accept-Encoding');

      // 1. Brotli (Best compression, Cloudflare default)
      if (/\bbr\b/.test(acceptEncoding)) {
        try {
          const compressed = zlib.brotliCompressSync(payload, {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // Fast edge compression level
            },
          });
          res.setHeader('Content-Encoding', 'br');
          res.setHeader('Content-Length', compressed.length);
          return originalSend(compressed);
        } catch (err) {
          console.warn('[Compression] Brotli compression failed, falling back:', err.message);
        }
      }

      // 2. Gzip (Broad compatibility)
      if (/\bgzip\b/.test(acceptEncoding)) {
        try {
          const compressed = zlib.gzipSync(payload, { level: 6 });
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Length', compressed.length);
          return originalSend(compressed);
        } catch (err) {
          console.warn('[Compression] Gzip compression failed, falling back:', err.message);
        }
      }

      // 3. Deflate fallback
      if (/\bdeflate\b/.test(acceptEncoding)) {
        try {
          const compressed = zlib.deflateSync(payload);
          res.setHeader('Content-Encoding', 'deflate');
          res.setHeader('Content-Length', compressed.length);
          return originalSend(compressed);
        } catch (err) {
          console.warn('[Compression] Deflate compression failed, falling back:', err.message);
        }
      }

      return originalSend(payload);
    }

    res.send = (body) => compressAndSend(body, false);
    res.json = (body) => compressAndSend(body, true);

    next();
  };
}

/**
 * Cache control middleware for read-only routes to enable Cloudflare edge micro-caching.
 * @param {number} maxAgeSeconds - Browser client max-age in seconds
 * @param {number} sMaxAgeSeconds - Cloudflare Edge CDN s-maxage in seconds
 * @param {number} staleWhileRevalidate - Background revalidation window
 */
export function edgeCache(maxAgeSeconds = 30, sMaxAgeSeconds = 120, staleWhileRevalidate = 300) {
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      res.setHeader(
        'Cache-Control',
        `public, max-age=${maxAgeSeconds}, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidate}`
      );
    }
    next();
  };
}
