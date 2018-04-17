export interface IEventItem {
    id: string;
    originalStartTimeZone: string;
    originalEndTimeZone: string;
    start: Date;
    end: Date;
    location: string;
    subject: string;
    body: string;
    attendees: string[];
    
  }