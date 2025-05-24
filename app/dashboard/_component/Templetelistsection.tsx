
import Templates from "@/app/(data)/Templates";
import React, { useEffect,useState } from "react";
import Templatecard from "./Templatecard";

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug: string;
  aiPrompt: string;
  form?: FORM[];
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

const Templetelistsection = ({ userSearchInput }: any) => {

  const [Templetelist, setTempletelist] = useState(Templates);

  useEffect(() => {
    // console.log(userSearchInput);

   if(userSearchInput){
    const filterData = Templates.filter(item=>item.name.toLowerCase().includes(userSearchInput.toLowerCase()))
    setTempletelist(filterData);
    }

    else{
      setTempletelist(Templates);
    }
  

  }, [userSearchInput]);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 bg-slate-100 lg:grid-cols-4 gap-5 p-10">
      {Templetelist.map((item: TEMPLATE, index: number) => (
        <Templatecard key={item.slug} {...item} />
      ))}
    </div>
  );
};

export default Templetelistsection;
