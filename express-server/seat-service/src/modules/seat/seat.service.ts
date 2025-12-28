import { SeatRepository } from './seat.repository';
import { getRedisClient } from '../../database/redis.connection';
import { Seat, CreateSeatDto, UpdateSeatDto, ReserveSeatDto } from './seat.entity';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export class SeatService {
  private seatRepository: SeatRepository;

  constructor() {
    this.seatRepository = new SeatRepository();
  }

  private getRedisClient() {
    return getRedisClient();
  }

  async getAllSeats(): Promise<ServiceResponse<Seat[]>> {
    try {
      const seats = await this.seatRepository.findAll();
      return {
        success: true,
        data: seats,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch seats',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getSeatById(id: number): Promise<ServiceResponse<Seat>> {
    try {
      const seat = await this.seatRepository.findById(id);
      if (!seat) {
        return {
          success: false,
          error: 'Seat not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: seat,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getSeatsByEventId(eventId: number): Promise<ServiceResponse<Seat[]>> {
    try {
      const seats = await this.seatRepository.findByEventId(eventId);
      return {
        success: true,
        data: seats,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch seats',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getAvailableSeatsByEventId(eventId: number): Promise<ServiceResponse<Seat[]>> {
    try {
      const seats = await this.seatRepository.findAvailableByEventId(eventId);
      return {
        success: true,
        data: seats,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch available seats',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createSeat(seatData: CreateSeatDto): Promise<ServiceResponse<Seat>> {
    try {
      const seat = await this.seatRepository.create(seatData);
      return {
        success: true,
        data: seat,
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateSeat(id: number, seatData: UpdateSeatDto): Promise<ServiceResponse<Seat>> {
    try {
      const seat = await this.seatRepository.findById(id);
      if (!seat) {
        return {
          success: false,
          error: 'Seat not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      const updatedSeat = await this.seatRepository.update(id, seatData);
      return {
        success: true,
        data: updatedSeat!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteSeat(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.seatRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Seat not found',
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
        error: error.message || 'Failed to delete seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async reserveSeat(reserveData: ReserveSeatDto): Promise<ServiceResponse<Seat>> {
    try {
      const seat = await this.seatRepository.findById(reserveData.seat_id);
      if (!seat) {
        return {
          success: false,
          error: 'Seat not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (seat.status !== 'available') {
        return {
          success: false,
          error: 'Seat is not available',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      const reservationKey = `seat:reservation:${reserveData.seat_id}:${reserveData.user_id}`;
      const expiresIn = reserveData.expires_in || 300;

      await this.getRedisClient().setEx(reservationKey, expiresIn, 'reserved');
      await this.seatRepository.updateStatus(reserveData.seat_id, 'reserved');

      const updatedSeat = await this.seatRepository.findById(reserveData.seat_id);
      return {
        success: true,
        data: updatedSeat!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reserve seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async releaseSeat(seatId: number, userId: string): Promise<ServiceResponse<Seat>> {
    try {
      const reservationKey = `seat:reservation:${seatId}:${userId}`;
      await this.getRedisClient().del(reservationKey);
      await this.seatRepository.updateStatus(seatId, 'available');

      const updatedSeat = await this.seatRepository.findById(seatId);
      return {
        success: true,
        data: updatedSeat!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to release seat',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

