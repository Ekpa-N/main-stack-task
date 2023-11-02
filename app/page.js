"use client"
import ImageHolder from "@/components/ImageComponent"
import { navMenu } from "@/constants/navMenu"
import { products } from "@/constants/products"
import LineChart from "@/components/LineChart"
import { CategoryScale } from "chart.js"
import Chart from 'chart.js/auto'
import ButtonMaker from "@/components/ButtonMaker"
import { walletMenu } from "@/constants/walletMenu"
import axios from "axios"
import { useEffect, useState } from "react"
import makeInitial from "@/functions/initialMaker"
import formatDate, { dateFormatLocale, setDateRange, dateSorter, dateFilter, getCurrentMonths, transactionSorted } from "@/functions/dateFormatter"
import FilterForm from "@/components/FilterForm"
import formValidator from "@/functions/formValidator"
import { sentenceCaser } from "@/functions/sentenceCaser"
import { transactionSets } from "@/constants/transactionSets"

Chart.register(CategoryScale)

export default function Home() {
  const initialFilterObject = {
    dateTo: "dd mm yyyy",
    dateFrom: "dd mm yyyy",
    type: [],
    status: []
  }
  const initialFocus = {
    type: false,
    status: false,
    dateFrom: false,
    dateTo: false
  }
  const allPromises = {
    user: axios.get("https://fe-task-api.mainstack.io/user"),
    wallet: axios.get("https://fe-task-api.mainstack.io/wallet"),
    transactions: axios.get("https://fe-task-api.mainstack.io/transactions"),
  }
  const [data, setData] = useState({ user: "", wallet: "", transactions: [] })
  const [initials, setInitials] = useState("")
  const [modal, setModal] = useState(false)
  const [focus, setFocus] = useState(initialFocus)
  const [filterData, setFilterData] = useState(initialFilterObject)
  const [activeFilters, setActiveFilters] = useState(0)
  const [activeTab, setActiveTab] = useState("Revenue")
  const [chartRange, setChartRange] = useState({ dateTo: "", dateFrom: "", count: 0 })
  const [filterCheck, setFilterCheck] = useState(true)
  const [chart, setChart] = useState([])
  // getCurrentMonths(transactionsResponse.data)


  const chartData = {
    // chart.map((item) => { return item.mth})
    labels: chart.map((item) => { return item.mth }),
    datasets: [
      {
        label: "Users Gained ",
        // chart.map((item) => { return item.amount})
        data: chart.map((item) => { return item.amount }),
        borderColor: "#FF5403",
        borderWidth: 1,
        tension: 0.4,
        radius: 0.01,
      }
    ]

  }


  useEffect(() => {
    Promise.all([allPromises.user, allPromises.wallet, allPromises.transactions])
      .then(([userResponse, walletResponse, transactionsResponse]) => {
        setData({ ...data, user: userResponse.data, wallet: walletResponse.data, transactions: transactionsResponse.data })
        const newInitials = makeInitial(userResponse.data.first_name, userResponse.data.last_name)
        setInitials(newInitials)
        const sortedTransactions = dateSorter(transactionsResponse.data.map((transaction) => transaction.date))
        const currentMonths = getCurrentMonths(transactionsResponse.data)
        // debugger
        setChartRange({ ...chartRange, dateTo: formatDate(sortedTransactions[sortedTransactions.length - 1]), dateFrom: formatDate(sortedTransactions[0]), count: sortedTransactions.length })
        const newChartData = getCurrentMonths(transactionsResponse.data)
        if (newChartData.length == 1) {
          newChartData.unshift({ mth: "RND", amount: 0 })
        }
        setChart(newChartData)
        
      })
      .catch(error => console.log(error))
  }, [])

  function getFilteredData(filter) {
    if (filter) {
      allPromises.transactions
        .then((transactionsResponse) => {
          setData({ ...data, transactions: transactionsResponse.data })
          const theDates = [filterData.dateTo, filterData.dateFrom]
          const theDatesFiltered = dateFilter(theDates, transactionsResponse.data)
          // debugger
          const firstMatches = []
          const filteredMatches = []
          filterData.status.forEach((status) => {
            let newStatus = status.toLowerCase()
            theDatesFiltered.forEach((transaction) => {
              if (transaction.status == newStatus) {
                firstMatches.push(transaction)
              }
            })
          })
          // debugger
          filterData.type.forEach((type) => {
            let newType = type.toLowerCase()
            firstMatches.forEach((transaction) => {
              if (transaction.type == newType) {
                filteredMatches.push(transaction)
              }
            })
          })
          // debugger
          setModalState(false)
          console.log("all matched: ", firstMatches)
          setData({ ...data, transactions: filteredMatches })
          const sortedTransactions = dateSorter(theDatesFiltered.map((transaction) => transaction.date))
          setChartRange({ ...chartRange, dateTo: formatDate(sortedTransactions[sortedTransactions.length - 1]), dateFrom: formatDate(sortedTransactions[0]), count: sortedTransactions.length })
          const newChartData = getCurrentMonths(filteredMatches)
          if (newChartData.length == 1) {
            newChartData.unshift({ mth: "RND", amount: 0 })
          }
          setChart(newChartData)
        })
        .catch(error => console.log(error))
      return
    }

    allPromises.transactions
      .then((transactionsResponse) => {
        setData({ ...data, transactions: transactionsResponse.data })
        const sortedTransactions = dateSorter(transactionsResponse.data.map((transaction) => transaction.date))
        setChartRange({ ...chartRange, dateTo: formatDate(sortedTransactions[sortedTransactions.length - 1]), dateFrom: formatDate(sortedTransactions[0]), count: sortedTransactions.length })
        const newChartData = getCurrentMonths(transactionsResponse.data)
        if (newChartData.length == 1) {
          newChartData.unshift({ mth: "RND", amount: 0 })
        }
        setChart(newChartData)
      })
      .catch(error => console.log(error))
  }

  function handleFocus(target) {
    if (target) {
      const tempFocus = { ...initialFocus, [target]: true }
      setFocus(tempFocus)
      return
    }
    setFocus(initialFocus)
  }

  function setModalState(state) {
    setModal(state)
  }

  function resetFilters() {
    setFilterData(initialFilterObject)
    setActiveFilters(0)
  }


  function handleFilterData(key, value, rangeSet = false) {
    if (rangeSet) {
      const tempFilter = { ...filterData, [rangeSet[0]]: value[0], [rangeSet[1]]: value[1] }
      setFilterData(tempFilter)
      if (formValidator(tempFilter, setActiveFilters) > 0) {
        setFilterCheck(true)
      } else {
        setFilterCheck(false)
      }
      return
    }
    const tempFilter = { ...filterData, [key]: value }
    if (formValidator(tempFilter, setActiveFilters) > 0) {
      setFilterCheck(true)
    } else {
      setFilterCheck(false)
    }
    // const allFilters = 
    setFilterData(tempFilter)
  }

  function clearFilter(e) {
    getFilteredData(false)
    resetFilters()
  }

  return (
    <main className="px-[16px] flex flex-col relative min-w-[1400px]">
      <div className={`ml-[-16px] w-screen ${modal ? "fixed" : "hidden"} flex justify-center h-screen overflow-hidden opacity-[0.7] bg-black z-[11]`}>
      </div>
      {/* ${modal ? "fixed" : "hidden"} */}
      <div className={`fixed h-[650px] ${modal ? "fixed" : "hidden"} w-[456px] z-[15] bg-[#ffffff] border left-[50%] ml-[-228px] mt-[20px] rounded-[20px]`}>
        <FilterForm searchFilter={getFilteredData} resetFilters={resetFilters} filterCheck={filterCheck} setDateRange={setDateRange} filterData={filterData} handleFilterData={handleFilterData} closeForm={setModalState} focus={focus} handleFocus={handleFocus} />
      </div>
      <div className="h-[16px] fixed top-0 z-[10] w-full bg-white borde"></div>
      <nav className={`${modal ? "blur-sm" : ""} flex z-[10] top-[16px] sticky px-[14px] h-[64px] justify-between items-center w-full rounded-[100px] border border-[#fff] shadow-lg bg-[#ffffff]`}>
        <div className="relative w-[36px] h-[36px] cursor-pointer">
          <ImageHolder src="./images/mainstack-logo.svg" filling={true} />
        </div>
        <ul className="gap-[15px] h-[40px] flex justify-between items-center">
          {navMenu.map((menu, index) => {
            return (
              <button key={index} className={`flex gap-[1px] rounded-[100px] h-full items-center ${activeTab == menu.name ? "bg-black" : ""} ${activeTab == menu.name ? "text-[white]" : ""} justify-center px-[15px] w-fit`}>
                <div className="w-[20px] h-[20px] relative">
                  <ImageHolder src={menu.img} filling={true} />
                </div>
                <h2>{menu.name}</h2>
              </button>
            )
          })}
        </ul>
        <div className="flex items-center w-[135px] justify-between h-[40px]">
          <div className="relative w-[20px] h-[20px]">
            <ImageHolder filling={true} src="./images/notifications.svg" />
          </div>
          <div className="relative w-[20px] h-[20px]">
            <ImageHolder filling={true} src="./images/chat.svg" />
          </div>
          <div className="w-[81px] rounded-[100px] h-full bg-[#EFF1F6] flex pl-[5px] items-center gap-[10px]">
            <div className="w-[32px] flex justify-center items-center h-[32px] rounded-[50%] bg-gradient-to-r to-[#131316] from-[#5C6670] border">
              <h2 className="font-[600] text-[14px] leading-[16px] text-white">
                {initials}
              </h2>
            </div>
            <div className="w-[17px] h-[10.55px] flex flex-col justify-between">
              <div className="bg-[black] h-[2px] rounded-[50px]"></div>
              <div className="bg-[black] h-[2px] rounded-[50px]"></div>
              <div className="bg-[black] h-[2px] rounded-[50px]"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* chart section */}

      <div className={`${modal ? "blur-sm" : ""} flex z-5 h-[360px] mt-[45px] justify-between borde w-[1200px]`}>
        <div className="w-[48px] mt-auto h-[192px] flex flex-col items-center justify-around border-[#fff] shadow-lg rounded-[100px]">
          {products.map((product, index) => {
            return (
              <div key={index} className="relative w-[24px] h-[24px]">
                <ImageHolder filling={true} src={product.img} />
              </div>
            )
          })}
        </div>

        <div className="w-[765px] h-full borde relative flex flex-col">
          <div className="flex items-center borde gap-[60px]">
            <div className="flex flex-col">
              <h2 className="font-[500] text-[14px] leading-[16px] text-[#56616B]">Available Balance</h2>
              <h2 className="font-[700] text-[36px] leading-[48px]">USD {data?.wallet?.balance || ""}</h2>
            </div>
            <ButtonMaker name={"Withdraw"} bg={"black"} textColor={"white"} />
          </div>
          <div className="borde bord-[green h-[329px]">
            <LineChart chartData={chartData} />
          </div>
          <div className="h-[35px] items-end flex justify-between border-t mt-auto absolute w-[100%] bottom-[-30px]">
            <div className="absolute bg-[#DBDEE5] w-[4px] top-[-3px] left-[-3px] h-[4px] rounded-[50%]"></div>
            <div className="absolute bg-[#DBDEE5] w-[4px] top-[-3px] right-[-3px] h-[4px] rounded-[50%]"></div>
            <h2 className="font-[500] text-[14px] leading-[16px] text-[#DBDEE5]">{chartRange.dateFrom}</h2>
            <h2 className="font-[500] text-[14px] leading-[16px] text-[#DBDEE5]">{chartRange.dateTo}</h2>
          </div>
        </div>


        <div className="w-[271px] h-[360px]">
          <ul className="flex flex-col h-full justify-between">
            {walletMenu.map((menu, index) => {
              return (
                <li key={index} className="w-full h-[66px] flex flex-col">
                  <div className="flex justify-between items-center">
                    <h2 className="text-[14px] font-[500] leading-[16px] text-[#56616B]">{menu.name}</h2>
                    <div className="h-[20px] w-[20px] relative">
                      <ImageHolder filling={true} src="./images/info.svg" />
                    </div>
                  </div>
                  <h2 className="font-[700] text-[28px] leading-[38px]">
                    {data.wallet[menu.type] ? `USD ${data.wallet[menu.type]}` : `USD 0`}
                  </h2>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* lower section */}


      <div className={`borde ${modal ? "blur-sm" : ""} z-5 min-h-[100px] ml-[106px] mt-[100px] w-[1094px] flex flex-col pb-[30px]`}>
        <div className="flex border-b-[1px] border-[#EFF1F6] h-[72px] justify-between">
          <div className="flex flex-col gap-[2px]">
            <h2 className="font-[700] text-[24px] leading-[32px]">{`${data?.transactions?.length} Transactions`}</h2>
            <h2 className="text-[14px] font-[500] leading-[16px] text-[#56616B]">Your transactions for all time</h2>
          </div>
          <div className="flex gap-[10px]">
            <button onClick={() => { setModalState(true) }} className="flex gap-[3px] h-[48px] bg-[#EFF1F6] rounded-[100px]  items-center justify-center px-[15px] w-[131px]">
              <h2>Filter</h2>
              <div className={`w-[20px] h-[20px] rounded-[50%] justify-center ${activeFilters > 0 ? "flex" : "hidden"} items-center text-[12px] font-[500] leading-[12px] text-[white] bg-[#131316]`}>
                <h2 className="borde h-[50%] w-[50%] text-center">{activeFilters}</h2>
              </div>
              <div className="w-[20px] h-[20px] relative">
                <ImageHolder src="./images/expand_more.svg" filling={true} />
              </div>
            </button>
            <button className="flex gap-[1px] bg-[#EFF1F6] rounded-[100px] h-[48px] items-center justify-center px-[15px] w-[139px]">
              <h2>Export list</h2>
              <div className="w-[20px] h-[20px] relative">
                <ImageHolder src="./images/download.svg" filling={true} />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-[30px] borde h-[300px] overflow-y-scroll flex flex-col gap-[20px] pr-[5px]">
          {data?.transactions?.length > 0 && data?.transactions?.map((transaction, index) => {
            return (
              <div key={index} className="flex justify-between h-[49px]">
                <div className="flex gap-[10px]">
                  <div className={`w-[48px] h-[48px] flex items-center justify-center rounded-[50%] ${transaction.type == "deposit" ? "bg-[#E3FCF2]" : "bg-[#F9E3E0]"}`}>
                    <div className="w-[20px] h-[20px] relative">
                      <ImageHolder filling={true} src={transaction.type == "withdrawal" ? "./images/call_made.svg" : "./images/call_received.svg"} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <h2 className="font-[500] text-[16px] leading-[24px]">{transaction.metadata?.product_name || sentenceCaser(transaction.type)}</h2>
                    <h2 className="font-[500] text-[#56616B] text-[14px] leading-[16px]">{transaction.metadata?.name || sentenceCaser(transaction.status)}</h2>
                  </div>
                </div>

                <div className="flex flex-col gap-[2px]">
                  <h2 className="font-[700] text-[16px] leading-[24px] text-end">{`USD ${transaction.amount}`}</h2>
                  <h2 className="text-[14px] font-[500] leading-[16px] text-end text-[#56616B]">{formatDate(transaction.date)}</h2>
                </div>
              </div>
            )
          })}

          {data?.transactions?.length == 0 && <div className="w-[369px] gap-[20px] min-h-[138px] flex flex-col m-auto">
            <div className="relative p-[10px] flex bg-gradient-to-r from-[#DBDEE5] to-[#F6F7F9] w-[48px] h-[48px] rounded-[16px] items-center justify-center">
              <div className="relative  w-[24px] h-[24px]">
                <ImageHolder filling={true} src="./images/receipt_long.svg" />
              </div>
            </div>
            <h2 className="text-[28px] text-[#131316] flex flex-wrap font-[700] leading-[40px] ">
              No matching transaction found for the selected filter
            </h2>
            <h2 className="font-[500] text-[16px] text-[#56616B] text-[left] leading-[24px]">
              Change your filters to see more results, or add a new product.
            </h2>
            <ButtonMaker bg={"#EFF1F6"} operation={clearFilter} name="Cancel" width="w-[198px]" />
          </div>
          }
        </div>
      </div>
    </main>
  )
}