import * as React from 'react';
import * as moment from 'moment';
import * as classNames  from 'classnames';

export default class DayView extends React.Component<any,any> {

    static propTypes = {
        events: React.PropTypes.array.isRequired,
        onDateSelect: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            date: moment(),
            events: this.props.events,
            selectedTime: {}
        };

    }

    // Check if a given hour has events
    hasEvents = (hour, minute = 0) => {
        for (let event of this.state.events) {
            const eventStartDate = moment(event.startDate);
            const eventEndDate = moment(event.endDate);
            const eventHour = moment({
                day: this.state.date.format('D'),
                month: this.state.date.format('M'),
                year: this.state.date.format('Y'),
                hour: hour,
                minute: minute
            });
            if (eventHour.isSame(eventStartDate) ||
                eventHour.isBetween(eventStartDate, eventEndDate) ||
                eventHour.isSame(eventEndDate)) {
                return true;
            }
        }
        return false;
    };

    // Jump to previous day
    getPreviousDay = () => {
        this.setState({
            month: this.state.date.subtract(1, 'days')
        });
    };

    // Jump to next day
    getNextDay = () => {
        this.setState({
            month: this.state.date.add(1, 'days')
        });
    };

    handleDateClick = (hour, minute = 0) => {
        const date = moment({
            day: this.state.date.format('D'),
            month: this.state.date.format('M'),
            year: this.state.date.format('Y'),
            hour: hour,
            minute: minute
        });
        const time = {
            hour: hour,
            minute: minute
        };
        this.setState({
            selectedTime: time
        });
        this.props.onDateSelect(date);
    };

    generateCalendar() {
        const hours = [];
        for (let hour = 0; hour <= 23; hour++) {
            let formatHour = hour < 10 ? `0${hour}` : hour;
            let hourSelected = this.state.selectedTime.hour === hour && this.state.selectedTime.minute === 0;
            const hourItemClassNames = classNames({
                'calendar__hours__hour__item': true,
                'calendar__hours__hour__item--event': this.hasEvents(hour) && !hourSelected,
                'calendar__hours__hour__item--selected': hourSelected
            });
            hours.push(
                <div className="calendar__hours__hour"
                     key={hour}
                >
                    <div className="calendar__hours__hour__title">{formatHour}:00</div>
                    <div className={hourItemClassNames}
                         onClick={() => {
                             this.handleDateClick(hour);
                         }}
                    ></div>
                </div>
            );

            hourSelected = this.state.selectedTime.hour === hour && this.state.selectedTime.minute === 30;
            const halfHourItemClassNames = classNames({
                'calendar__hours__hour__item': true,
                'calendar__hours__hour__item--event': this.hasEvents(hour, 30) && !hourSelected,
                'calendar__hours__hour__item--selected': hourSelected
            });
            hours.push(
                <div className="calendar__hours__hour"
                     key={`${hour}-3`}
                >
                    <div className="calendar__hours__hour__title">{formatHour}:30</div>
                    <div className={halfHourItemClassNames}
                         onClick={() => {
                             this.handleDateClick(hour, 30);
                         }}
                    ></div>
                </div>
            );
        }
        return hours;
    }

    render() {
        const calendar = this.generateCalendar();
        const monthSelectorArrowLeftClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-left': true
        });
        const monthSelectorArrowRightClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-right': true
        });

        return (
            <div className="calendar__day-view">
                <div className="calendar__date-selector">
                    <div className={monthSelectorArrowLeftClassNames}
                         onClick={this.getPreviousDay}
                    >&#10094;</div>
                    <div className="calendar__date-selector__date-name">
                        {this.state.date.format('dddd')}
                    </div>
                    <div className={monthSelectorArrowRightClassNames}
                         onClick={this.getNextDay}
                    >&#10095;</div>
                </div>
                <div className="calendar__header">
                    <h1>{this.state.date.format('dddd, D MMMM')}</h1>
                </div>
                <div className="calendar__hours">
                    {calendar}
                </div>
            </div>
        );
    }
}
