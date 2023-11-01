export default function formValidator(obj, setFilterCount) {
    let counter = 0;  
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === "dd mm yyyy" || (Array.isArray(obj[key]) && obj[key].length === 0)) {
          counter++;
        }
      }
    }  
    setFilterCount(3 - counter)
    return counter;
  }