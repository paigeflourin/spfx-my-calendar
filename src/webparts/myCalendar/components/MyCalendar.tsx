import * as React from 'react';
import styles from './MyCalendar.module.scss';
import { IMyCalendarProps } from './IMyCalendarProps';
import { IMyCalendarState } from './IMyCalendarState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import  Calendar  from './Calendar';
import { IEventItem } from './IEventItem';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import * as AuthenticationContext from 'adal-angular';
import adalConfig from '../AdalConfig';
import { IAdalConfig } from '../../IAdalConfig';
import '../../WebPartAuthenticationContext';






export default class MyCalendar extends React.Component<IMyCalendarProps, any> {
    private authCtx: adal.AuthenticationContext;

    public token = null;  

    constructor(props: IMyCalendarProps, context?: any) {
        super(props);

        /*this.state = {
            events: [
                {
                    id: 1,
                    startDate: moment(new Date(2018, 4, 14, 10, 0)),
                    endDate: moment(new Date(2018, 4, 14, 14, 0))
                },
                {
                    id: 2,
                    startDate: moment(new Date(2018, 4, 15, 16, 0)),
                    endDate: moment(new Date(2018, 4, 16, 18, 0))
                },
                {
                    id: 3,
                    startDate: moment(new Date(2018, 4, 20, 20, 0)),
                    endDate: moment(new Date(2018, 4, 25, 21, 0))
                }
            ],
            newEvent: false,
            selectedDateEvents: null

        } */

        this.state = {
            events: [],
            newEvent: false,
            selectedDateEvents: null
        }

        
        const config: IAdalConfig = adalConfig;
        config.popUp = true;
        config.webPartId = this.props.webPartId;
        config.callback = (error: any, token: string): void => {
        this.setState((previousState: IMyCalendarState, currentProps: IMyCalendarProps): IMyCalendarState => {
            previousState.error = error;
            previousState.signedIn = !(!this.authCtx.getCachedUser());
            return previousState;
        });
    };

    this.authCtx = new AuthenticationContext(config);
    AuthenticationContext.prototype._singletonInstance = undefined;
    }

    public componentDidMount(): void {
        
        console.log("entered component did mount");
        
        this.authCtx.handleWindowCallback();

        if (window !== window.top) {
        return;
        }
        

        this.setState((previousState: IMyCalendarState, props: IMyCalendarProps): IMyCalendarState => {
            previousState.error = this.authCtx.getLoginError();
            previousState.signedIn = !(!this.authCtx.getCachedUser());
            return previousState;
          });

        
    }

    public componentDidUpdate(prevProps: IMyCalendarProps, prevState: IMyCalendarState, prevContext: any): void {
        
        console.log("entered component did update");
        if (prevState.signedIn !== this.state.signedIn) {
          this.loadUpcomingMeetings();
        }
      }

    handleSelectedDate = (date) => {
        this.setState({
            //selectedDateEvents: this.refs.calendar.getEvents(date)
            selectedDateEvents: date
        });
        console.log(date);
    };

    handleMonthChange = (month) => {
        // TODO: Month changed
    };
    

    renderEvents = () => {
        const events = [];
        for (let event of this.state.selectedDateEvents) {
            events.push(
                <div className="list__item"
                    key={event.id}
                >
                    <div className="row">
                        <div className="row__column">
                            <small>From</small>
                        </div>
                        <div className="row__column">
                            <small>To</small>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row__column">
                            {event.startDate.format('HH:mm')}
                        </div>
                        <div className="row__column">
                            {event.endDate.format('HH:mm')}
                        </div>
                    </div>
                </div>
            );
        }

        if (events.length === 0) {
            return (
                <h2>No events to display</h2>
            )
        }
        return (
            <div>
                <h1>Events</h1>
                <div className="list">
                    {events}
                </div>
            </div>
        );
    };
    
    public render(): React.ReactElement<IMyCalendarProps> { 
        const login: JSX.Element = this.state.signedIn ? <div /> : <button onClick={() => { this.signIn(); } }><span>Sign in</span><span>Sign in to see your upcoming meetings</span></button>;
        let events = null;
        if (this.state.selectedDateEvents) {
            events = this.renderEvents();
        }

        return (
        <div>
            {login}
            <Calendar ref="calendar"
                                events={this.state.events}
                                onDateSelect={this.handleSelectedDate}
                                onMonthChange={this.handleMonthChange}
            />
            
            {events}
            <hr />
        
            <button> Add <i className="ms-Icon ms-Icon--circlePlus" aria-hidden="true"></i></button>

        </div>
        );
    }

    public signIn(): void {
        this.authCtx.login();
    }
    
    private loadUpcomingMeetings(): void {
        this.setState((previousState: IMyCalendarState, props: IMyCalendarProps): IMyCalendarState => {
            previousState.loading = true;
            return previousState;
        });

        this.getGraphAccessToken()
            .then((accessToken: string): Promise<IEventItem[]> => {
            return MyCalendar.getUpcomingMeetings(accessToken, this.props.httpClient);
            })
            .then((events: IEventItem[]): void => {
            this.setState((prevState: IMyCalendarState, props: IMyCalendarProps): IMyCalendarState => {
                prevState.loading = false;
                prevState.events = events;
                return prevState;
            });
            }, (error: any): void => {
            this.setState((prevState: IMyCalendarState, props: IMyCalendarProps): IMyCalendarState => {
                prevState.loading = false;
                prevState.error = error;
                return prevState;
            });
            });
    }

    private getGraphAccessToken(): Promise<string> {
        return new Promise<string>((resolve: (accessToken: string) => void, reject: (error: any) => void): void => {
            const graphResource: string = 'https://graph.microsoft.com';
            const accessToken: string = this.authCtx.getCachedToken(graphResource);
            if (accessToken) {
            resolve(accessToken);
            return;
            }

            if (this.authCtx.loginInProgress()) {
            reject('Login already in progress');
            return;
            }

            this.authCtx.acquireToken(graphResource, (error: string, token: string) => {
            if (error) {
                reject(error);
                return;
            }

            if (token) {
                resolve(token);
            }
            else {
                reject('Couldn\'t retrieve access token');
            }
            });
        });
    }

    private static getUpcomingMeetings(accessToken: string, httpClient: HttpClient): Promise<IEventItem[]> {
        return new Promise<IEventItem[]>((resolve: (upcomingMeetings: IEventItem[]) => void, reject: (error: any) => void): void => {
          const now: Date = new Date();
          const dateString: string = now.getUTCFullYear() + '-' + MyCalendar.getPaddedNumber(now.getUTCMonth() + 1) + '-' + MyCalendar.getPaddedNumber(now.getUTCDate());
          const startDate: string = dateString + 'T' + MyCalendar.getPaddedNumber(now.getUTCHours()) + ':' + MyCalendar.getPaddedNumber(now.getUTCMinutes()) + ':' + MyCalendar.getPaddedNumber(now.getUTCSeconds()) + 'Z';
          const endDate: string = dateString + 'T23:59:59Z';
    
          httpClient.get('https://graph.microsoft.com/v1.0/me/calendar/events', HttpClient.configurations.v1, {
            headers: {
              'Accept': 'application/json;odata.metadata=none',
              'Authorization': 'Bearer ' + accessToken
            }
          })
            .then((response: HttpClientResponse): Promise<{ value: IEventItem[] }> => {
                console.log("hey");
                console.log(response); 
                return response.json();

            }, (error: any): void => {
              reject(error);
            });
        });
      }

    private static getPaddedNumber(n: number): string {
        if (n < 10) {
        return '0' + n;
        }
        else {
        return n.toString();
        }
    }


}
