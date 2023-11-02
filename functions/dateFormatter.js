export default function formatDate(inputDate) {
  const dateArray = inputDate.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthString = months[parseInt(dateArray[1], 10) - 1];
  const formattedDate = monthString + ' ' + dateArray[2] + ', ' + dateArray[0];

  return formattedDate;
}

export function dateFormatLocale(inputDate) {
  if (inputDate == "dd mm yyyy") {
    return inputDate
  }
  const dateObject = new Date(inputDate);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = dateObject.toLocaleDateString('en-US', options);

  return formattedDate;
}

export function setDateRange(backDate, handleFilter, filter = true) {
  let today = new Date()
  let previousDate = new Date()
  if (backDate > 0) {
    previousDate.setDate(previousDate.getDate() - backDate)
    if (!filter) {
      return [today, previousDate]
    }
    handleFilter("dateTo", [previousDate, today], ["dateTo", "dateFrom"])
    return
  }
  handleFilter("dateTo", [today, today], ["dateTo", "dateFrom"])
}


export function dateSorter(dates) {
  return dates.sort((a, b) => new Date(b) - new Date(a));
}


export function dateFilter(dateRange, transactions) {
  const [startDate, endDate] = dateRange.map(date => new Date(date));

  return transactions.filter(transaction => {
    if (transaction.date) {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    }
    return false;
  });
}


export function getCurrentMonths(transactions) {
  const months = [];
  const amountObjects = []
  const final = []

  transactions.forEach(transaction => {
    if (transaction.date) {
      const date = new Date(transaction.date);
      const month = date.toLocaleString('default', { month: 'long' });
      amountObjects.push({ mth: month, amount: transaction.amount })
      if (!months.includes(month)) {
        months.push(month);
      }
    }
  });
  months.forEach((month) => {
    let sum = 0
    amountObjects.forEach((obj) => {
      if(obj.mth == month){
        sum = sum + obj.amount
      }
    })
    final.push({mth:month, amount:sum})
  })
  console.log("final: ", final)

  return final;
}


