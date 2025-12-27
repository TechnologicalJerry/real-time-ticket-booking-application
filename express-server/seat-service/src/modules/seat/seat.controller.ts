import { Request, Response } from 'express';
import { SeatService } from './seat.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class SeatController {
  private seatService: SeatService;

  constructor() {
    this.seatService = new SeatService();
  }

  getAllSeats = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.seatService.getAllSeats();

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch seats', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seats fetched successfully');
  };

  getSeatById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.seatService.getSeatById(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch seat', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seat fetched successfully');
  };

  getSeatsByEventId = async (req: Request, res: Response): Promise<Response> => {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await this.seatService.getSeatsByEventId(eventId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch seats', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seats fetched successfully');
  };

  getAvailableSeatsByEventId = async (req: Request, res: Response): Promise<Response> => {
    const eventId = parseInt(req.params.eventId, 10);
    const result = await this.seatService.getAvailableSeatsByEventId(eventId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch available seats', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Available seats fetched successfully');
  };

  createSeat = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.seatService.createSeat(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to create seat', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'Seat created successfully');
  };

  updateSeat = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.seatService.updateSeat(id, req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to update seat', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seat updated successfully');
  };

  deleteSeat = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.seatService.deleteSeat(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to delete seat', result.statusCode);
    }

    return res.status(204).send();
  };

  reserveSeat = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.seatService.reserveSeat(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to reserve seat', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seat reserved successfully');
  };

  releaseSeat = async (req: Request, res: Response): Promise<Response> => {
    const seatId = parseInt(req.params.seatId, 10);
    const userId = req.body.user_id || req.headers['user-id'] as string;

    if (!userId) {
      return ResponseUtil.badRequest(res, 'User ID is required');
    }

    const result = await this.seatService.releaseSeat(seatId, userId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to release seat', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Seat released successfully');
  };
}

