import * as React from 'react';
import * as moment from 'moment';
import * as classNames  from 'classnames';
import './styles/style.scss';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

/*
 Props
 * events {array} - array of events
 * defaultView {string} - default calendar view (day, week or month)
 * onDateSelect {function} - callback when a date is selected
 * onMonthChange {function} - callback when the month as changed
 */

export default class Calendar extends React.Component<any,any> {

    static propTypes = {
        events: React.PropTypes.array.isRequired,
        defaultView: React.PropTypes.string,
        onDateSelect: React.PropTypes.func,
        onMonthChange: React.PropTypes.func
    };

    static defaultProps = {
        defaultView: 'month'
    };

    constructor(props) {
        super(props);

        this.state = {
            month: moment(),
            calendar: [],
            view: this.props.defaultView,
            events: this.props.events
        };

    }

    // Return events for a given date
    getEvents = (date) => {
        const events = [];
        for (let event of this.state.events) {
            let eventStartDate = null;
            let eventEndDate = null;
            switch (this.state.view) {
                case 'day':
                case 'week':
                    eventStartDate = moment(event.startDate);
                    eventEndDate = moment(event.endDate);
                    if (date.isSame(eventStartDate) ||
                        date.isBetween(eventStartDate, eventEndDate) ||
                        date.isSame(eventEndDate)) {
                        events.push(event);
                    }
                    break;

                default:
                    eventStartDate = moment(event.startDate).day();
                    if (eventStartDate === date.day()) {
                        events.push(event);
                    }
                    break
            }
        }
        return events;
    };

    handleChangeView = (view) => {
        this.setState({
            view
        });
    };

    handleSelectedDate = (date) => {
        this.props.onDateSelect(date);
    };

    handleMonthChange = (month) => {
        this.setState({
            selectedMonth: month
        });
        this.props.onMonthChange(month);
    };

    render() {
        let calendarView = null;
        switch (this.state.view) {
            case 'day':
                calendarView = (
                    <DayView events={this.state.events}
                             onDateSelect={this.handleSelectedDate}
                             onMonthChange={this.handleMonthChange}/>
                );
                break;

            case 'week':
                calendarView = (
                    <WeekView events={this.state.events}
                              onDateSelect={this.handleSelectedDate}
                              onMonthChange={this.handleMonthChange}/>
                );
                break;

            default:
                calendarView = (
                    <MonthView ref="monthView"
                               events={this.state.events}
                               onDateSelect={this.handleSelectedDate}
                               onMonthChange={this.handleMonthChange}/>
                );
                break
        }

        const dayViewClassNames = classNames({
            'calendar__view-selector__item': true,
            'calendar__view-selector__item--selected': this.state.view === 'day'
        });
        const weekViewClassNames = classNames({
            'calendar__view-selector__item': true,
            'calendar__view-selector__item--selected': this.state.view === 'week'
        });
        const monthViewClassNames = classNames({
            'calendar__view-selector__item': true,
            'calendar__view-selector__item--selected': this.state.view === 'month'
        });

        return (
            <div className="calendar">
                <div className="calendar__controls">
                    <div className="calendar__view-selector">
                        <div className={dayViewClassNames}
                             onClick={() => {
                                 this.handleChangeView('day');
                             }}
                        >
                            Day
                        </div>
                        <div className={weekViewClassNames}
                             onClick={() => {
                                 this.handleChangeView('week');
                             }}
                        >
                            Week
                        </div>
                        <div className={monthViewClassNames}
                             onClick={() => {
                                 this.handleChangeView('month');
                             }}
                        >
                            Month
                        </div>
                    </div>
                </div>
                {calendarView}
            </div>
        );
    }
}
