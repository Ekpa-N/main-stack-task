import ButtonMaker from "./ButtonMaker"
import Formfield from "./FormFields"
import { fixedPeriods, transactionTypes, transactionStatus } from "@/constants/filters"

export default function FilterForm({setDateRange, closeForm, focus, handleFocus, filterData, handleFilterData, filterCheck, resetFilters, searchFilter }) {
    function formCloser(e, state=false) {
        e.preventDefault()
        searchFilter(false)        
        resetFilters()
        closeForm(state)
    }
    
    function handleSearch (e) {
        e.preventDefault()
        searchFilter(true)        
    }

    function checkboxFilter(e) {
        // e.preventDefault()
        let tempFilterData = filterData[e.target.id]
        if (e.target.checked) {
            tempFilterData.push(e.target.name)
            handleFilterData(e.target.id, tempFilterData)
            return
        }
        tempFilterData = tempFilterData.filter(item => item != e.target.name)
        handleFilterData(e.target.id, tempFilterData)
    }

    function dateRange(e, backDate, handleFilter) {
        e.preventDefault()
        setDateRange(backDate, handleFilter)
    }

    return (
        <form onClick={(e) => { handleFocus(false) }} className="w-full flex flex-col h-full rounded-[20px] p-[15px] gap-[20px]">
            <div className="flex justify-between">
                <h2 className="text-[#131316] font-degular font-[700] text-[24px] leading-[28.8px]">
                    Filter
                </h2>
                <button onClick={(e) => { formCloser(e, false) }} className="ml-auto w-[24px] h-[24px] relative rounded-[5px]">
                    <div className="h-[1px] bg-[black] rounded-[3px] absolute origin-center mt-[-2px] rotate-[45deg] w-[12.6px]"></div>
                    <div className="h-[1px] bg-[black] rounded-[3px] absolute origin-center mt-[-2px] rotate-[-45deg] w-[12.6px]"></div>
                </button>
            </div>

            <div className="flex justify-between w-full">
                {fixedPeriods.map((period, index) => {
                    return (
                        <button onClick={(e)=>{dateRange(e, period.duration, handleFilterData)}} key={index} className="flex gap-[1px] h-[36px] bg-white border border-[#EFF1F6]  rounded-[100px]  items-center justify-center px-[16px] min-w-[70px]">
                            <h2 className="font-[600] text-degular text-[14px] leading-[16px]">{period.name}</h2>
                        </button>
                    )
                })}
            </div>
            <div className="w-full justify-between flex">
                <Formfield value={filterData["dateTo"]} title="Date Range" type="select-date" name="dateTo" focus={focus["dateTo"]} handleFocus={handleFocus} op={handleFilterData} id="dateTo" />
                <Formfield value={filterData["dateFrom"]} title="Date Range" titleColor="text-white" type="select-date" name="dateFrom" focus={focus["dateFrom"]} handleFocus={handleFocus} op={handleFilterData} id="dateFrom" pos={2} />
            </div>

            <Formfield value={filterData["type"]} title="Transaction Type" type="checkbox" name="type" focus={focus["type"]} handleFocus={handleFocus} options={transactionTypes} op={checkboxFilter} id="type" />
            <Formfield value={filterData["status"]} title="Transaction Status" type="checkbox" name="status" focus={focus["status"]} handleFocus={handleFocus} options={transactionStatus} op={checkboxFilter} id="status" />

            <div className={`flex justify-between mt-auto`}>
                <ButtonMaker operation={formCloser} name="Cancel" width="w-[198px]" />
                <ButtonMaker operation={handleSearch} disabled={filterCheck} name="Apply" width="w-[198px]" bg={filterCheck ? "#EFF1F6" : "black"} />
            </div>

        </form>
    )
}