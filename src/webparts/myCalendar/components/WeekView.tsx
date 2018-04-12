import * as React from 'react';
import * as moment from 'moment';
import * as classNames  from 'classnames';

export default class WeekView extends React.Component<any,any> {

    static propTypes = {
        events: React.PropTypes.array.isRequired,
        onDateSelect: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            date: moment(),
            events: this.props.events,
            selectedDate: {}
        };
    }

    // Jump to previous day
    getPreviousWeek = () => {
        this.setState({
            date: this.state.date.subtract(7, 'days')
        });
    };

    // Jump to next day
    getNextWeek = () => {
        this.setState({
            date: this.state.date.add(7, 'days')
        });
    };

    // Check if a given hour has events
    hasEvents = (day, hour, minute = 0) => {
        const date = moment(this.state.date).weekday(day);
        for (let event of this.state.events) {
            const eventStartDate = moment(event.startDate);
            const eventEndDate = moment(event.endDate);
            const currentEventDate = moment({
                day: date.format('D'),
                month: date.format('M'),
                year: date.format('Y'),
                hour: hour,
                minute: minute
            });
            if (currentEventDate.isSame(eventStartDate) ||
                currentEventDate.isBetween(eventStartDate, eventEndDate) ||
                currentEventDate.isSame(eventEndDate)) {
                return true;
            }
        }
        return false;
    };

    handleDateClick = (day, hour, minute = 0) => {
        const date = moment(this.state.date).weekday(day);
        const selectedDate = moment({
            day: date.format('D'),
            month: date.format('M'),
            year: date.format('Y'),
            hour: hour,
            minute: minute
        });
        this.setState({
            selectedDate: {
                day: day,
                hour: hour,
                minute: minute
            }
        });
        this.props.onDateSelect(selectedDate);
    };

    generateCalendar() {
        const hours = [];
        for (let hour = 0; hour <= 23; hour++) {
            let formatHour = hour < 10 ? `0${hour}` : hour;
            let hourDays = [];
            for (let day = 0; day < 7; day++) {
                const hourSelected = this.state.selectedDate.day === day &&
                    this.state.selectedDate.hour === hour &&
                    this.state.selectedDate.minute === 0;
                const hourItemClassNames = classNames({
                    'calendar__hours__hour__days__item': true,
                    'calendar__hours__hour__days__item--event': this.hasEvents(day, hour) && !hourSelected,
                    'calendar__hours__hour__days__item--selected': hourSelected
                });
                hourDays.push(
                    <div className={hourItemClassNames}
                         key={day}
                         onClick={() => {
                             this.handleDateClick(day, hour);
                         }}
                    ></div>
                );
            }
            hours.push(
                <div className="calendar__hours__hour"
                     key={hour}
                >
                    <div className="calendar__hours__hour__title">{formatHour}:00</div>
                    <div className="calendar__hours__hour__days">
                        {hourDays}
                    </div>
                </div>
            );

            let halfHourDays = [];
            for (let day = 0; day < 7; day++) {
                const hourSelected = this.state.selectedDate.day === day &&
                    this.state.selectedDate.hour === hour &&
                    this.state.selectedDate.minute === 0;
                const hourItemClassNames = classNames({
                    'calendar__hours__hour__days__item': true,
                    'calendar__hours__hour__days__item--event': this.hasEvents(day, hour, 30) && !hourSelected,
                    'calendar__hours__hour__days__item--selected': hourSelected
                });
                halfHourDays.push(
                    <div className={hourItemClassNames}
                         key={day}
                         onClick={() => {
                             this.handleDateClick(day, hour, 30);
                         }}
                    ></div>
                );
            }
            hours.push(
                <div className="calendar__hours__hour"
                     key={`${hour}-3`}
                >
                    <div className="calendar__hours__hour__title">{formatHour}:30</div>
                    <div className="calendar__hours__hour__days">
                        {halfHourDays}
                    </div>
                </div>
            );
        }
        return hours;
    }

    render() {
        const calendar = this.generateCalendar();
        const weekSelectorArrowLeftClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-left': true
        });
        const weekSelectorArrowRightClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-right': true
        });
        return (
            <div className="calendar__week-view">
                <div className="calendar__date-selector">
                    <div className={weekSelectorArrowLeftClassNames}
                         onClick={this.getPreviousWeek}
                    >&#10094;</div>
                    <div className="calendar__date-selector__date-name">
                        {this.state.date.format('MMMM')}
                    </div>
                    <div className={weekSelectorArrowRightClassNames}
                         onClick={this.getNextWeek}
                    >&#10095;</div>
                </div>
                <div className="calendar__header">
                    <div className="calendar__header__day-name">{this.state.date.weekday(0).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(1).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(2).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(3).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(4).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(5).format('ddd DD')}</div>
                    <div className="calendar__header__day-name">{this.state.date.weekday(6).format('ddd DD')}</div>
                </div>
                <div className="calendar__hours">
                    {calendar}
                </div>
            </div>
        );
    }
}
