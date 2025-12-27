import { PaymentRepository } from './payment.repository';
import { config } from '../../config/env';
import { Payment, CreatePaymentDto, ProcessPaymentDto, RefundPaymentDto } from './payment.entity';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export class PaymentService {
  private paymentRepository: PaymentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
  }

  async getAllPayments(): Promise<ServiceResponse<Payment[]>> {
    try {
      const payments = await this.paymentRepository.findAll();
      return {
        success: true,
        data: payments,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch payments',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getPaymentById(id: number): Promise<ServiceResponse<Payment>> {
    try {
      const payment = await this.paymentRepository.findById(id);
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: payment,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getPaymentsByUserId(userId: string): Promise<ServiceResponse<Payment[]>> {
    try {
      const payments = await this.paymentRepository.findByUserId(userId);
      return {
        success: true,
        data: payments,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch payments',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getPaymentByBookingId(bookingId: number): Promise<ServiceResponse<Payment>> {
    try {
      const payment = await this.paymentRepository.findByBookingId(bookingId);
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: payment,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createPayment(paymentData: CreatePaymentDto): Promise<ServiceResponse<Payment>> {
    try {
      const existingPayment = await this.paymentRepository.findByBookingId(paymentData.booking_id);
      if (existingPayment) {
        return {
          success: false,
          error: 'Payment already exists for this booking',
          statusCode: HTTP_STATUS.CONFLICT,
        };
      }

      const payment = await this.paymentRepository.create(paymentData);
      return {
        success: true,
        data: payment,
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async processPayment(processData: ProcessPaymentDto): Promise<ServiceResponse<Payment>> {
    try {
      const payment = await this.paymentRepository.findById(processData.payment_id);
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (payment.status !== 'pending') {
        return {
          success: false,
          error: 'Payment is not in pending status',
          statusCode: HTTP_STATUS.BAD_REQUEST,
        };
      }

      const updatedPayment = await this.paymentRepository.update(processData.payment_id, {
        status: 'completed',
        transaction_id: processData.transaction_id,
        payment_date: new Date(),
      });

      return {
        success: true,
        data: updatedPayment!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to process payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async refundPayment(refundData: RefundPaymentDto): Promise<ServiceResponse<Payment>> {
    try {
      const payment = await this.paymentRepository.findById(refundData.payment_id);
      if (!payment) {
        return {
          success: false,
          error: 'Payment not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (payment.status !== 'completed') {
        return {
          success: false,
          error: 'Only completed payments can be refunded',
          statusCode: HTTP_STATUS.BAD_REQUEST,
        };
      }

      const updatedPayment = await this.paymentRepository.update(refundData.payment_id, {
        status: 'refunded',
      });

      return {
        success: true,
        data: updatedPayment!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refund payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deletePayment(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.paymentRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Payment not found',
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
        error: error.message || 'Failed to delete payment',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

