import { Router, Request, Response, NextFunction } from 'express';
import { proxyService } from '../proxy/proxy.service';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import { ResponseUtil } from '../../shared/utils/response.util';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  const route = proxyService.getRouteForPath(req.path);

  if (!route) {
    ResponseUtil.notFound(res, 'Route not found');
    return;
  }

  if (route.requiresAuth) {
    authMiddleware(req as AuthRequest, res, next);
    return;
  }

  next();
});

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  const proxy = proxyService.getProxyForPath(req.path);

  if (!proxy) {
    ResponseUtil.notFound(res, 'Service not found');
    return;
  }

  (proxy as any)(req, res, next);
});

export default router;

