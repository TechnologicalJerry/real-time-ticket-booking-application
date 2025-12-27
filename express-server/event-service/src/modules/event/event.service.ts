import { EventRepository } from './event.repository';
import { Event, CreateEventDto, UpdateEventDto } from './event.entity';
import { ServiceResponse } from '../../../shared/types/common.types';
import { HTTP_STATUS } from '../../../shared/constants/http-status.constants';

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async getAllEvents(): Promise<ServiceResponse<Event[]>> {
    try {
      const events = await this.eventRepository.findAll();
      return {
        success: true,
        data: events,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch events',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async getEventById(id: number): Promise<ServiceResponse<Event>> {
    try {
      const event = await this.eventRepository.findById(id);
      if (!event) {
        return {
          success: false,
          error: 'Event not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }
      return {
        success: true,
        data: event,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch event',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createEvent(eventData: CreateEventDto): Promise<ServiceResponse<Event>> {
    try {
      if (eventData.available_seats > eventData.total_seats) {
        return {
          success: false,
          error: 'Available seats cannot exceed total seats',
          statusCode: HTTP_STATUS.BAD_REQUEST,
        };
      }

      const event = await this.eventRepository.create(eventData);
      return {
        success: true,
        data: event,
        statusCode: HTTP_STATUS.CREATED,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create event',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateEvent(id: number, eventData: UpdateEventDto): Promise<ServiceResponse<Event>> {
    try {
      const event = await this.eventRepository.findById(id);
      if (!event) {
        return {
          success: false,
          error: 'Event not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      if (eventData.total_seats !== undefined && eventData.available_seats !== undefined) {
        if (eventData.available_seats > eventData.total_seats) {
          return {
            success: false,
            error: 'Available seats cannot exceed total seats',
            statusCode: HTTP_STATUS.BAD_REQUEST,
          };
        }
      }

      const updatedEvent = await this.eventRepository.update(id, eventData);
      return {
        success: true,
        data: updatedEvent!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update event',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async deleteEvent(id: number): Promise<ServiceResponse<void>> {
    try {
      const deleted = await this.eventRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'Event not found',
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
        error: error.message || 'Failed to delete event',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async updateAvailableSeats(id: number, quantity: number): Promise<ServiceResponse<Event>> {
    try {
      const event = await this.eventRepository.findById(id);
      if (!event) {
        return {
          success: false,
          error: 'Event not found',
          statusCode: HTTP_STATUS.NOT_FOUND,
        };
      }

      const updated = await this.eventRepository.updateAvailableSeats(id, quantity);
      if (!updated) {
        return {
          success: false,
          error: 'Failed to update available seats',
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        };
      }

      const updatedEvent = await this.eventRepository.findById(id);
      return {
        success: true,
        data: updatedEvent!,
        statusCode: HTTP_STATUS.OK,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update available seats',
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

