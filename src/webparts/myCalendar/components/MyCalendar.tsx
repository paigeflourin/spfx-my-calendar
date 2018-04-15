import * as React from 'react';
import styles from './MyCalendar.module.scss';
import { IMyCalendarProps } from './IMyCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import  Calendar  from './Calendar';

import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as request from 'superagent';
const accessToken:string = "";


export default class MyCalendar extends React.Component<IMyCalendarProps, any> {
  
constructor(props) {
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
}

public componentDidMount(): void {

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
    let events = null;
    if (this.state.selectedDateEvents) {
        events = this.renderEvents();
    }

    return (
      <div>
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




  
}
