import { Router } from 'express';
import { SeatController } from './seat.controller';

const router = Router();
const seatController = new SeatController();

router.get('/', seatController.getAllSeats);
router.get('/event/:eventId', seatController.getSeatsByEventId);
router.get('/event/:eventId/available', seatController.getAvailableSeatsByEventId);
router.get('/:id', seatController.getSeatById);
router.post('/', seatController.createSeat);
router.post('/reserve', seatController.reserveSeat);
router.post('/:seatId/release', seatController.releaseSeat);
router.put('/:id', seatController.updateSeat);
router.delete('/:id', seatController.deleteSeat);

export default router;

