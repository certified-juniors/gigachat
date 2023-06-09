import { useState } from "react";


export const GenderSelect = ( {onChange} ) => {
  const [gender, setGender] = useState("");
  const [focus, setFocus] = useState(false);
  const handleGenderChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center bg-transperent pb-2">
     
      <select
        id="gender-select"
        className={`rounded-md border-white-20 bg-transparent border ${focus?"text-white":"text-gray-400"} color-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        onFocus={()=>setFocus(true)}
        onChange={handleGenderChange}
      >
        <option className="bg-white/20 text-black" value="male">Мужской</option>
        <option className="bg-white/20  text-black" value="female">Женский</option>
        <option className="bg-white/20  text-black" value="non-binary">Вертолет Апач</option>
      </select>
    </div>
  );
}
 