import React, {useCallback, useEffect, useRef, useMemo, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {Agenda, Calendar} from 'react-native-calendars';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import dayjs from 'dayjs';
// import * as weekday from 'dayjs/plugin/weekday';

const App = () => {
  // useEffect(() => {
  //   dayjs.extend(weekday);
  // }, []);

  const WEEKDAYS = useMemo(
    () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    [],
  );
  // const TODAY = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

  const [currentMonthYear, setCurrentMonthYear] = useState(() => {
    const currentYear = dayjs().format('YYYY');
    const currentMonth = dayjs().format('M');
    return {year: currentYear, month: currentMonth};
  });

  const currentMonthText = useMemo(() => {
    dayjs(new Date(currentMonthYear.year, currentMonthYear.month - 1)).format(
      'MMMM YYYY',
    );
  }, [currentMonthYear]);

  const monthDays = useMemo(() => {
    const currentMonthDays = createDaysForCurrentMonth(
      currentMonthYear.year,
      currentMonthYear.month,
    );
    const previousMonthDays = createDaysForPreviousMonth(
      currentMonthYear.year,
      currentMonthYear.month,
      currentMonthDays[0].dayOfWeek,
    );
    const nextMonthDays = createDaysForNextMonth(
      currentMonthYear.year,
      currentMonthYear.month,
      currentMonthDays[currentMonthDays.length - 1].dayOfWeek,
    );
    console.log('monthDays: ', [
      ...currentMonthDays,
      ...previousMonthDays,
      ...nextMonthDays,
    ]);
    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [currentMonthYear]);

  // ------------------ //
  // utility functions
  // ------------------ //
  function getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
  }

  function createDaysForCurrentMonth(year, month) {
    return [...Array(getNumberOfDaysInMonth(year, month))].map(
      (_day, index) => {
        return {
          date: dayjs(`${year}-${month}-${index + 1}`).format('YYYY-MM-DD'),
          dayOfMonth: index + 1,
          dayOfWeek: dayjs(`${year}-${month}-${index + 1}`).day(),
          isCurrentMonth: true,
        };
      },
    );
  }

  function createDaysForPreviousMonth(year, month, currentMonthFirstDayOfWeek) {
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = currentMonthFirstDayOfWeek
      ? currentMonthFirstDayOfWeek - 1
      : 6;

    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthFirstDayOfWeek)
      .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
      .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
      (_day, index) => {
        return {
          date: dayjs(
            `${previousMonth.year()}-${previousMonth.month() + 1}-${
              previousMonthLastMondayDayOfMonth + index
            }`,
          ).format('YYYY-MM-DD'),
          dayOfMonth: previousMonthLastMondayDayOfMonth + index,
          isCurrentMonth: false,
        };
      },
    );
  }

  function createDaysForNextMonth(year, month, currentMonthLastDayOfWeek) {
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    console.log('currentMonthLastDayOfWeek: ', currentMonthLastDayOfWeek);
    const visibleNumberOfDaysFromNextMonth = 7 - currentMonthLastDayOfWeek;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      return {
        date: dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`,
        ).format('YYYY-MM-DD'),
        dayOfMonth: index + 1,
        isCurrentMonth: false,
      };
    });
  }

  // const getWeekday = useCallback(date => {
  //   return dayjs(date).weekday();
  // }, []);

  // function initMonthSelectors() {
  //   document
  //     .getElementById('previous-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(selectedMonth).subtract(1, 'month');
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });

  //   document
  //     .getElementById('present-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(new Date(INITIAL_YEAR, INITIAL_MONTH - 1, 1));
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });

  //   document
  //     .getElementById('next-month-selector')
  //     .addEventListener('click', function () {
  //       selectedMonth = dayjs(selectedMonth).add(1, 'month');
  //       createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'));
  //     });
  // }

  const [dayBgColor, setDayBgColor] = useState({});

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.sidebarContainer}></View>
      <View style={styles.calendarContainer}>
        {/* <View style={styles.daysOfWeek}>
          {WEEKDAYS.map(weekday => {
            <Text>{weekday}</Text>;
          })}
        </View> */}
        <View style={styles.monthDays}>
          {monthDays?.map((day, i) => {
            return (
              <View
                key={`monthDay-${i}`}
                style={[
                  styles.day,
                  {
                    width: `${(1 / 7) * 100}%`,
                    height: `${(1 / 6) * 100}%`,
                    backgroundColor:
                      dayBgColor.dayIndex === i
                        ? dayBgColor.color
                        : day.isCurrentMonth
                        ? 'white'
                        : 'lightgrey',
                  },
                ]}
                onMouseEnter={() => {
                  setDayBgColor({dayIndex: i, color: 'lightblue'});
                }}
                onMouseLeave={() => {
                  setDayBgColor({});
                }}>
                <View style={styles.dayTextContainer}>
                  <Text>{day.dayOfMonth}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    flex: 1,
  },
  calendarContainer: {
    flex: 5,
  },
  daysOfWeek: {},
  monthDays: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  dayTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 5,
    paddingRight: 5,
  },
  day: {},
});

export default App;
