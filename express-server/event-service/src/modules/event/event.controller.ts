import { Request, Response } from 'express';
import { EventService } from './event.service';
import { ResponseUtil } from '../../../shared/utils/response.util';

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  getAllEvents = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.eventService.getAllEvents();

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch events', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Events fetched successfully');
  };

  getEventById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.eventService.getEventById(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to fetch event', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Event fetched successfully');
  };

  createEvent = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.eventService.createEvent(req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to create event', result.statusCode);
    }

    return ResponseUtil.created(res, result.data, 'Event created successfully');
  };

  updateEvent = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.eventService.updateEvent(id, req.body);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to update event', result.statusCode);
    }

    return ResponseUtil.success(res, result.data, 'Event updated successfully');
  };

  deleteEvent = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id, 10);
    const result = await this.eventService.deleteEvent(id);

    if (!result.success) {
      return ResponseUtil.error(res, result.error || 'Failed to delete event', result.statusCode);
    }

    return res.status(204).send();
  };
}

