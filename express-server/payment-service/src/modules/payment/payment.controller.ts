import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  getAllPayments = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.paymentService.getAllPayments();

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch payments', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payments fetched successfully');
  };

  getPaymentById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.paymentService.getPaymentById(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch payment', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payment fetched successfully');
  };

  getPaymentsByUserId = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.userId;
    const result = await this.paymentService.getPaymentsByUserId(userId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch payments', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payments fetched successfully');
  };

  getPaymentByBookingId = async (req: Request, res: Response): Promise<Response> => {
    const bookingId = parseInt(req.params.bookingId, 10);
    const result = await this.paymentService.getPaymentByBookingId(bookingId);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch payment', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payment fetched successfully');
  };

  createPayment = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.paymentService.createPayment(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to create payment', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'Payment created successfully');
  };

  processPayment = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.paymentService.processPayment(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to process payment', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payment processed successfully');
  };

  refundPayment = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.paymentService.refundPayment(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to refund payment', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Payment refunded successfully');
  };

  deletePayment = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.paymentService.deletePayment(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to delete payment', result.statusCode);
    }

    return res.status(204).send();
  };
}

