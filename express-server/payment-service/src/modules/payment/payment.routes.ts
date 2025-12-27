import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.get('/', paymentController.getAllPayments);
router.get('/user/:userId', paymentController.getPaymentsByUserId);
router.get('/booking/:bookingId', paymentController.getPaymentByBookingId);
router.get('/:id', paymentController.getPaymentById);
router.post('/', paymentController.createPayment);
router.post('/process', paymentController.processPayment);
router.post('/refund', paymentController.refundPayment);
router.delete('/:id', paymentController.deletePayment);

export default router;

