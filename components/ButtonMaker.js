export default function ButtonMaker({name, operation, bg="black", textColor="white", width=false, disabled=false}) {
    const bgColor=`bg-[${bg}]`
    return (
        <button onClick={(e)=>{operation(e)}} disabled={disabled} className={`${width ? width : "w-[167px]"} h-[52px] rounded-[100px] ${bgColor} text-[white]`}>
            {name}
        </button>
    )
}