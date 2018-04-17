
import { HttpClient } from '@microsoft/sp-http';


export interface IMyCalendarProps {
  title: string;
  httpClient: HttpClient;
  webPartId: string;
}
