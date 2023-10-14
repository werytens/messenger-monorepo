import React, { useEffect, useState } from 'react';
import cl from './Calendar.module.css';


function getWeeksInMonth(year: number, month: number): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    const weeks = Math.ceil(daysInMonth / 7);
    return weeks;
}

interface DateInfo {
    nowDate: Date;
    nowYear: number;
    nowMonthNumber: number;
    newMonthName: string;
    monthName: string;
    monthDayCount: number;
    weekCount: number;
    dayCount: number;
}


const getMatrix = (dateInfo: DateInfo) => {
    const startArray: number[] = [0, 0, 0, 0, 0, 0, 0];
    
    let lastPos = getDayIndex(dateInfo, 1);
    startArray[lastPos] = 1;
    for (let day = 2; day <= dateInfo.dayCount; day++) {        
        lastPos++;

        startArray[lastPos] = day;
    }

    const matrix = [];
    for (let i = 0; i < startArray.length; i += 7) {
        let chunk = startArray.slice(i, i + 7);
        if (chunk.length < 7) {
            const missingElements = 7 - chunk.length;
            const zeros = Array(missingElements).fill(0);
            chunk = [...chunk, ...zeros];
        }
        matrix.push(chunk);
    }

    return matrix
}

const getDayIndex = (dateInfo: DateInfo, dayNumber: number) => {
    const testDate = new Date(dateInfo.nowYear, dateInfo.nowMonthNumber - 1, 1);
    const customIndexesFormat = [6, 0, 1, 2, 3, 4, 5];
    return customIndexesFormat[testDate.getDay()]
}

const Calendar: React.FC = () => {
    localStorage.setItem('lastpage', '5')
    
    const [daysMatrix, setDaysMatrix] = useState<number[][]>([[]]);
    const [nowMonth, setNowMonth] = useState<string>('');
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const dateInfo: DateInfo = {
            nowDate: new Date(),
            nowYear: new Date().getFullYear(),
            nowMonthNumber: new Date().getMonth() + 1,
            newMonthName: new Date().toLocaleString('default', { month: 'long' }),
            monthName: new Date().toLocaleString('default', { month: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleString('default', { month: 'long' }).slice(1),
            monthDayCount: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(),
            weekCount: getWeeksInMonth(new Date().getFullYear(), new Date().getMonth() + 1),
            dayCount: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
        };        

        setNowMonth(dateInfo.monthName);
        setDaysMatrix(getMatrix(dateInfo));

        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
      
        return () => {
            clearInterval(interval);
        };
    }, [])

    return (
        <div className={cl.root}>
            <div className={cl.content}>
                <h1 className={cl.table_title}>
                    {nowMonth + ', ' }
                    {String(time.getHours()).length === 1 ? "0" + time.getHours() : time.getHours()}
                    :
                    {String(time.getMinutes()).length === 1 ? "0" + time.getMinutes() : time.getMinutes()}
                    {', ' + new Date().getFullYear() + ' г.'}
                </h1>
                <table>
                    <thead>
                        <tr className="titles">
                            <th>Пн</th>
                            <th>Вт</th>
                            <th>Ср</th>
                            <th>Чт</th>
                            <th>Пт</th>
                            <th>Сб</th>
                            <th>Вс</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daysMatrix.map((item, index) => (
                            <tr key={index}>
                                {item.map((day, index) => (
                                    <td key = {index}
                                        className={Number(day) === Number(new Date().getDate()) ? cl.now_day : ''}
                                    >
                                        {day === 0 ? "" : day}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Calendar;