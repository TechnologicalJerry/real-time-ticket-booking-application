import axios from 'axios';
import { BookingRepository } from './booking.repository';
import { config } from '../../config/env';
import { Booking, CreateBookingDto, UpdateBookingDto } from './booking.entity';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export class BookingService {
  private bookingRepository: BookingRepository;

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async getAllBookings(): Promise<ServiceResponse<Booking[]>> {
    try {
      const bookings = await this.bookingRepository.findAll();
      return {
        success: true,
        data: bookings,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch bookings',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getBookingById(id: number): Promise<ServiceResponse<Booking>> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        return {
          success: false,
          error: 'Booking not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: booking,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch booking',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getBookingsByUserId(userId: string): Promise<ServiceResponse<Booking[]>> {
    try {
      const bookings = await this.bookingRepository.findByUserId(userId);
      return {
        success: true,
        data: bookings,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch bookings',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createBooking(bookingData: CreateBookingDto): Promise<ServiceResponse<Booking>> {
    try {
      const [eventResponse, seatResponse] = await Promise.all([
        axios.get(`${config.services.event}/${bookingData.event_id}`),
        axios.get(`${config.services.seat}/${bookingData.seat_id}`),
      ]);

      const event = eventResponse.data?.data || eventResponse.data;
      const seat = seatResponse.data?.data || seatResponse.data;

      if (!event || !seat) {
        return {
          success: false,
          error: 'Event or seat not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (seat.status !== 'available' && seat.status !== 'reserved') {
        return {
          success: false,
          error: 'Seat is not available',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      if (event.available_seats <= 0) {
        return {
          success: false,
          error: 'No seats available for this event',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      const booking = await this.bookingRepository.create(bookingData);

      await Promise.all([
        axios.put(`${config.services.seat}/${bookingData.seat_id}`, { status: 'booked' }),
        axios.put(`${config.services.event}/${bookingData.event_id}`, {
          available_seats: event.available_seats - 1,
        }),
      ]);

      return {
        success: true,
        data: booking,
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create booking',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateBooking(id: number, bookingData: UpdateBookingDto): Promise<ServiceResponse<Booking>> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        return {
          success: false,
          error: 'Booking not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      const updatedBooking = await this.bookingRepository.update(id, bookingData);
      return {
        success: true,
        data: updatedBooking!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update booking',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async cancelBooking(id: number): Promise<ServiceResponse<Booking>> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        return {
          success: false,
          error: 'Booking not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (booking.status === 'cancelled') {
        return {
          success: false,
          error: 'Booking is already cancelled',
          statusCode: HTTP_STATUS.BAD_REQUEST,
        };
      }

      const updatedBooking = await this.bookingRepository.update(id, { status: 'cancelled' });

      await Promise.all([
        axios.put(`${config.services.seat}/${booking.seat_id}`, { status: 'available' }),
        axios.get(`${config.services.event}/${booking.event_id}`).then((response) => {
          const event = response.data?.data || response.data;
          return axios.put(`${config.services.event}/${booking.event_id}`, {
            available_seats: event.available_seats + 1,
          });
        }),
      ]);

      return {
        success: true,
        data: updatedBooking!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to cancel booking',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteBooking(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.bookingRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Booking not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        statusCode: HTTP_STATUS.NO_CONTENT,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete booking',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

