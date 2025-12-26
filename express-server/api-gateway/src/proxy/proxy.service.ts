import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { serviceRoutes, ServiceRoute } from './proxy.config';
import { logger } from '../../shared/utils/logger.util';

export class ProxyService {
  private createProxy(target: string): ReturnType<typeof createProxyMiddleware> {
    const options: Options = {
      target,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      onError: (err: Error, req: Request, res: Response) => {
        logger.error('Proxy error:', err.message);
        if (res && !res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Service unavailable',
            error: err.message,
          });
        }
      },
      onProxyReq: (proxyReq, req: Request) => {
        logger.info(`Proxying ${req.method} ${req.url} to ${target}`);
      },
    };
    return createProxyMiddleware(options);
  }

  getProxyForPath(path: string): ReturnType<typeof createProxyMiddleware> | null {
    const route = serviceRoutes.find((r) => path.startsWith(r.path));
    if (!route) {
      return null;
    }
    return this.createProxy(route.target);
  }

  getRouteForPath(path: string): ServiceRoute | undefined {
    return serviceRoutes.find((r) => path.startsWith(r.path));
  }
}

export const proxyService = new ProxyService();

