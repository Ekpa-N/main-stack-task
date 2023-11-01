"use client"

import ImageHolder from "./ImageComponent"
import { useState } from "react"
import DateSelector from "./DateSelector"
import { dateFormatLocale } from "@/functions/dateFormatter"


export default function Formfield({ title, type = "text", value, name, bg = "bg-[#F3F3F3]", focus, formEdit, handleFocus, options, op, id, titleColor="text-black", pos, isChecked=false }) {
    function manageFocus(e, name) {
        e.stopPropagation()
        handleFocus(name)
    }

    function caretFocusHandler(e, name) {
        e.preventDefault()
        e.stopPropagation()
        if (focus) {
            handleFocus(false)
            return
        }
        handleFocus(name)
    }

    if (type == "select-date") {
        return (
            <div onClick={(e) => { manageFocus(e, name) }} className="flex w-[48%] relative flex-col">
                <h2 className={`font-[600] text-[16px] ${titleColor} leading-[24px]`}>{title}</h2>
                <div name={name} className={`flex ${focus ? "bg-white z-[2] border-[3px] border-black" : "bg-[#EFF1F6] border-[1px]"} h-[48px] px-[15px] border rounded-[12px] w-full justify-between items-center`}>
                    <input value={dateFormatLocale(value)} className="borde outline-none h-[30px] w-[85%] bg-inherit truncate" type="text" readOnly />
                    <button onClick={(e) => { caretFocusHandler(e, name) }} className="w-[20px] h-[20px] relative">
                        <ImageHolder filling={true} src={focus ? "./images/expand_less.svg" : "./images/expand_more.svg"} />
                    </button>
                </div>
                <div className={`absolute h-[353px] ${pos == 2 ? "left-[-220px]":""} w-[209%] top-[80px] z-[5] bg-[#ffffff] rounded-[12px] p-[20px] ${focus ? "flex" : "hidden"} flex-col gap-[20px] shadow-lg`}>
                    <DateSelector handleFilterData={op} dataKey={id} />
                </div>

            </div>
        )
    }
    if (type == "checkbox") {
        return (
            <div onClick={(e) => { manageFocus(e, name) }} className="flex w-full relative flex-col">
                <h2 className="font-[600] text-[16px] leading-[24px]">{title}</h2>
                <div name={name} className={`flex ${focus ? "bg-white z-[2] border-[3px] border-black" : "bg-[#EFF1F6] border-[1px]"} h-[48px] px-[15px] border rounded-[12px] w-full justify-between items-center`}>
                    <input value={value.join(", ")} className="borde outline-none h-[30px] w-[85%] bg-inherit truncate" type="text" readOnly />
                    <button onClick={(e) => { caretFocusHandler(e, name) }} className="w-[20px] h-[20px] relative">
                        <ImageHolder filling={true} src={focus ? "./images/expand_less.svg" : "./images/expand_more.svg"} />
                    </button>
                </div>
                <div className={`absolute w-full top-[80px] z-[5] bg-[#ffffff] rounded-[12px] p-[20px] ${focus ? "flex" : "hidden"} flex-col gap-[20px] shadow-lg`}>
                    {options.map((option, index) => {
                        return (
                            <div key={index} className="flex gap-[10px]">
                                <input checked={value.includes(option.name)} onClick={(e) => { op(e) }} name={option.name} type="checkbox" id={id} className="relative peer shrink-0 appearance-none w-[20px] h-[20px] rounded-sm bg-inherit mt-1 checked:bg-[#1C1B1F] checked:border-[#1C1B1F] border border-[#D9D9D9]"
                                />
                                <label className="font-[600] text-[16px] leading-[24px]" htmlFor={id}>{option.name}</label>
                                <svg
                                    className="absolute w-4 h-4 mt-[6px] ml-[2px] hidden peer-checked:block pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                        )
                    })}
                </div>

            </div>
        )
    }


}

// export default function Formfield({ title, type = "text", value, name, bg = "bg-[#F3F3F3]", formFields, setFormFields, formEdit, selectOptions = "", charType = "text" }) {
//     if (type == "select-text") {
//         return (
//             <div className="flex items-center relative h-full group justify-center w-full  rounded-[inherit]">
//                 <label className="text-[12px] font-[400] top-[-10px] left-[45px] font-interegular absolute w-fit text-[#777777] bg-[white] px-[4px]">{title}</label>
//                 <select value={value} name={name} className={`h-full outline-none pl-[25px] font-interegular text-[14px] font-[400] rounded-[10px] ${bg} w-[95%] rounded-[inherit]`}>
//                     {selectOptions.map((option, index) => {
//                         if (option == value) {
//                             console.log("The option: ", option)
//                             console.log("The value: ", value)
//                             return <option key={index} value={option} selected>{option}</option>
//                         }
//                         return <option key={index} value={option}>{option}</option>
//                     })}
//                 </select>
//             </div>
//         )
//     }
//     if (type == "select-date") {
//         return (
//             <div className="flex items-center relative h-full group justify-center w-full  rounded-[inherit]">
//                 <label className="text-[12px] font-[400] top-[-10px] left-[45px] font-interegular absolute w-fit text-[#777777] bg-[white] px-[4px]">{title}</label>
//                 <select value={value} name={name} onChange={(e) => { formEdit(e) }} className={`h-full outline-none pl-[25px] font-interegular text-[14px] font-[400] rounded-[10px] ${bg} w-[95%] rounded-[inherit]`}>
//                     {selectOptions.map((option, index) => {
//                         if (option == value) {
//                             console.log("The option: ", option)
//                             console.log("The value: ", value)
//                             return <option key={index} value={option} selected>{option}</option>
//                         }
//                         return <option key={index} value={option}>{option}</option>
//                     })}
//                 </select>
//             </div>
//         )
//     }
//     if (type == "checkbox") {
//         return (
//             <div className="flex w-full flex-col">
//                 <div className="flex rounded-[12px] w-full justify-between items-center">
//                     <input type="" />
//                 </div>
//                 <div className="flex gap-2">
//                     <input onClick={(e) => { inputSet(e) }} name="checkbox" type="checkbox" id="some_id" className="
//                 relative peer shrink-0
//                 appearance-none w-[20px] h-[20px] rounded-sm bg-white
//                 mt-1
//                  checked:bg-[#1C1B1F] checked:border-[#1C1B1F] border border-[#D9D9D9]"
//                     />
//                     <label htmlFor="some_id">checkbox</label>
//                     <svg
//                         className="
//                 absolute
//                 w-4 h-4 mt-[6px] ml-[2px]
//                  hidden peer-checked:block
//                  pointer-events-none"
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="#ffffff"
//                         strokeWidth="4"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <polyline points="20 6 9 17 4 12"></polyline>
//                     </svg>
//                 </div>
//             </div>
//         )
//     }


// }