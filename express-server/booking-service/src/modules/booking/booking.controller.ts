import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  getAllBookings = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.bookingService.getAllBookings();

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch bookings', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Bookings fetched successfully');
  };

  getBookingById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.bookingService.getBookingById(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch booking', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Booking fetched successfully');
  };

  getBookingsByUserId = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const result = await this.bookingService.getBookingsByUserId(userId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch bookings', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Bookings fetched successfully');
  };

  createBooking = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.bookingService.createBooking(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to create booking', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'Booking created successfully');
  };

  updateBooking = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.bookingService.updateBooking(id, req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to update booking', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Booking updated successfully');
  };

  cancelBooking = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.bookingService.cancelBooking(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to cancel booking', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Booking cancelled successfully');
  };

  deleteBooking = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.bookingService.deleteBooking(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to delete booking', result.statusCode);
    }

    return res.status(204).send();
  };
}

