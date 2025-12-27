import { Router } from 'express';
import { BookingController } from './booking.controller';

const router = Router();
const bookingController = new BookingController();

router.get('/', bookingController.getAllBookings);
router.get('/user/:userId', bookingController.getBookingsByUserId);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.post('/:id/cancel', bookingController.cancelBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;

