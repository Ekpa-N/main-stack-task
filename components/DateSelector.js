"use client"
import TheCalendar from "./Calendar"
import ImageHolder from "./ImageComponent"
import { months } from "@/constants/months"



export default function DateSelector({handleFilterData, dataKey}) {
    return (
        <section className="borde h-full w-full">
            <TheCalendar handleFilterData={handleFilterData} dataKey={dataKey}/>
        </section>
    )
}