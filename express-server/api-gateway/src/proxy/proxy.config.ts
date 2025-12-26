import { config } from '../config/env';

export interface ServiceRoute {
  path: string;
  target: string;
  methods: string[];
  requiresAuth: boolean;
}

export const serviceRoutes: ServiceRoute[] = [
  {
    path: '/api/auth',
    target: config.services.auth,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: false,
  },
  {
    path: '/api/users',
    target: config.services.user,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: true,
  },
  {
    path: '/api/events',
    target: config.services.event,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: false,
  },
  {
    path: '/api/seats',
    target: config.services.seat,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: true,
  },
  {
    path: '/api/bookings',
    target: config.services.booking,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: true,
  },
  {
    path: '/api/payments',
    target: config.services.payment,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    requiresAuth: true,
  },
];

