import * as React from 'react';
import * as moment from 'moment';
import * as classNames  from 'classnames';

export default class MonthView extends React.Component<any,any> {

    static propTypes = {
        events: React.PropTypes.array.isRequired,
        onDateSelect: React.PropTypes.func.isRequired,
        onMonthChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            month: moment(),
            events: this.props.events,
            selectedDay: null
        };
    }

    // Check a given day has events
    hasEvents = (day) => {
        for (let event of this.state.events) {
            const eventDay = moment(event.startDate).format('D');
            if (eventDay == day) {
                return true;
            }
        }
        return false;
    };

    // Get the position of the first day of the month
    getFirstDayPosition = () => {
        let position = 0;
        switch (this.state.month.startOf('month').format('ddd')) {
            case 'Mon':
                position = 1;
                break;

            case 'Tue':
                position = 2;
                break;

            case 'Wed':
                position = 3;
                break;

            case 'Thu':
                position = 4;
                break;

            case 'Fri':
                position = 5;
                break;

            case 'Sat':
                position = 6;
                break;

            default:
                position = 0;
                break;
        }
        return position;
    };

    // Jump to previous month
    getPreviousMonth = () => {
        this.setState({
            month: this.state.month.subtract(1, 'month')
        });
        this.props.onMonthChange(this.state.month);
    };

    // Jump to next month
    getNextMonth = () => {
        this.setState({
            month: this.state.month.add(1, 'month')
        });
        this.props.onMonthChange(this.state.month);
    };

    handleDayClick = (day) => {
        const date = moment({
            day: day,
            month: this.state.month.format('M'),
            year: this.state.month.format('Y')
        });
        this.setState({
            selectedDay: day
        });
        this.props.onDateSelect(date);
    };

    generateCalendar = () => {
        const calendar = [];
        const firstDayPosition = this.getFirstDayPosition();
        //const selectedMonth = Object.assign({}, this.state.month);
        const selectedMonth = this.state.month;

        // Add last days of previous month
        const daysInPreviousMonth = moment(selectedMonth).subtract(1, 'month').daysInMonth();
        const initialPreviousMonthDay = daysInPreviousMonth - firstDayPosition + 1;

        const lastDayClassNames = classNames({
            'calendar__month-view__days__item': true,
            'calendar__month-view__days__item--previous-month': true
        });

        let itemKey = 0;
        for (let day = initialPreviousMonthDay; day <= daysInPreviousMonth; day++) {
            calendar.push(
                <div className={lastDayClassNames }
                     key={itemKey}
                >
                    {day}
                </div>
            );
            itemKey++;
        }

        // Add current month days
        for (let day = 1; day <= this.state.month.daysInMonth(); day++) {
            let event = this.hasEvents(day);
            const dayClassNames = classNames({
                'calendar__month-view__days__item': true,
                'calendar__month-view__days__item--event': event && this.state.selectedDay !== day,
                'calendar__month-view__days__item--selected': this.state.selectedDay === day
            });
            calendar.push(
                <div className={dayClassNames}
                     key={itemKey}
                     onClick={() => {
                         this.handleDayClick(day);
                     }}
                >
                    {day}
                </div>
            );
            itemKey++;
        }
        return calendar;
    };

    render() {
        const dateSelectorArrowLeftClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-left': true
        });
        const dateSelectorArrowRightClassNames = classNames({
            'calendar__date-selector__controller': true,
            'calendar__date-selector__controller__arrow-right': true
        });
        const days = this.generateCalendar();
        return (
            <div className="calendar__month-view">
                <div className="calendar__date-selector">
                    <div className={dateSelectorArrowLeftClassNames}
                         onClick={this.getPreviousMonth}
                    >&#10094;</div>
                    <div className="calendar__date-selector__date-name">
                        {this.state.month.format('MMMM')}
                    </div>
                    <div className={dateSelectorArrowRightClassNames}
                         onClick={this.getNextMonth}
                    >&#10095;</div>
                </div>
                <div className="calendar__header">
                    <div className="calendar__header__day-name">Sun</div>
                    <div className="calendar__header__day-name">Mon</div>
                    <div className="calendar__header__day-name">Tue</div>
                    <div className="calendar__header__day-name">Wed</div>
                    <div className="calendar__header__day-name">Thu</div>
                    <div className="calendar__header__day-name">Fri</div>
                    <div className="calendar__header__day-name">Sat</div>
                </div>
                <div className="calendar__month-view__days">
                    {days}
                </div>
            </div>
        );
    }
}
