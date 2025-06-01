// src/infrastructure/event-outbox/EventOutbox.ts
import mongoose, { Document, Schema } from 'mongoose';
import cron from 'node-cron';

// Outbox schema for transactional event storage
interface IEventOutboxDocument extends Document {
  eventId: string;
  type: string;
  payload: any;
  delivered: boolean;
  occurredAt: Date;
  deliveredAt?: Date;
}

const EventOutboxSchema = new Schema<IEventOutboxDocument>({
  eventId: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  delivered: { type: Boolean, required: true, default: false },
  occurredAt: { type: Date, required: true },
  deliveredAt: { type: Date }
});

const EventOutboxModel = mongoose.model<IEventOutboxDocument>('EventOutbox', EventOutboxSchema);

export class EventOutbox {
  static async saveEvent(event: { id: string; type: string; payload: any; occurredAt: Date }) {
    await new EventOutboxModel({
      eventId: event.id,
      type: event.type,
      payload: event.payload,
      occurredAt: event.occurredAt,
      delivered: false
    }).save();
  }

  static async deliverPendingEvents() {
    const events = await EventOutboxModel.find({ delivered: false }).lean();
    for (const event of events) {
      try {
        // Here you would integrate with event handlers or message brokers.
        console.log(`Delivering event ${event.type} with id ${event.eventId}`, event.payload);

        // Mark delivered
        await EventOutboxModel.updateOne(
          { eventId: event.eventId },
          { delivered: true, deliveredAt: new Date() }
        );
      } catch (err) {
        console.error('Failed to deliver event', err);
      }
    }
  }

  static startCronDelivery() {
    cron.schedule('* * * * *', async () => {
      console.log('Running event delivery cron job...');
      await EventOutbox.deliverPendingEvents();
    });
  }
  
}
