import { IEventItem } from './IEventItem';

export interface IMyCalendarState {
   events: IEventItem[];
   error: string;
   signedIn: boolean;
   loading: boolean;
   
   
 }