"use client";
import { useEffect, useState } from "react";

const MultipleCheckboxInput = ({ items = [], value, setValue }) => {
  const [options, setOptions] = useState(items);


 const handleOptionClick=(index)=>{
    let array=[...options];
    array[index].isSelected=!array[index]?.isSelected;
    setOptions(array);
 }


useEffect(()=>{
    setValue([...options]?.filter((i)=>i?.isSelected))
},[options])

  useEffect(() => {
    if (items?.length > 0)
      setOptions(items?.map((i) => {
     let isInArray=value?.find((item)=>i?._id==item?._id||i===item);
     
    return     { ...i, isSelected:isInArray?true:false }}));
  }, [items,value]);

  return (
    <div className="flex items-stretch gap-2 flex-wrap w-full">
      {options?.map((item, index) => (
        <button  onClick={()=>handleOptionClick(index)} key={`option-${item?.title}-${index}`} className="p-2 flex items-center gap-2">
          <input className="h-[24px] border border-[#eee] w-[24px]" type="checkbox" checked={item?.isSelected} />
          <p className="m-0 font-semibold">{item?.title}</p>
        </button>
      ))}
    </div>
  );
};

export default MultipleCheckboxInput;
