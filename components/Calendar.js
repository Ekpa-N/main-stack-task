"use client"
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { dateFormatLocale } from '@/functions/dateFormatter';


export default function TheCalendar({handleFilterData, dataKey}) {
    const [date, setDate] = useState(new Date());

    function onChange(date) {
        // console.log(dateFormatLocale(date))
        handleFilterData(dataKey, date)       
    }

    return (

        <Calendar
            next2Label={"›"}
            nextLabel={"»"}
               onChange={onChange}
            // value={date}
            prevLabel="«"
            prev2Label="‹"
        />

    );
}