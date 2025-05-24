"use client"
import React from 'react'
import { TEMPLATE } from '../../_component/Templetelistsection'
import Image from 'next/image'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
import { useState } from 'react'


interface PROPS{
   selectedTemplete?:TEMPLATE;
   userFormInput:any
}

const Formsection = ({selectedTemplete,userFormInput}:PROPS) => {
    
  const [formData, setFormData] = useState<any>()

   

    const handleinputchange=(event:any)=>{
     const {name, value} = event.target
      setFormData({...formData, [name]: value})
     
    }
     const  onsubmit = (e:any)=>{
      e.preventDefault()
      //  console.log(formData); 
      userFormInput(formData)
       document.dispatchEvent(new Event('contentGenerated'));
    }
    
  return (
    <div className='p-5 m-3 shadow-lg border rounded-lg bg-white'>
      {/* @ts-ignore */}
      <Image src={selectedTemplete?.icon} alt="icon" height={70} width={70} />
     <h2 className='font-bold text-2xl mb-2 text-primary' >{selectedTemplete?.name}</h2>
     <p className='text-sm text-gray-600'>{selectedTemplete?.desc}</p>
     
     <form action="" onSubmit={onsubmit} className='mt-6 '>
      {selectedTemplete?.form?.map((item, index) => (
        <div className='my-2 flex flex-col gap-2 mb-7' key={index}>
          <label className='font-bold' htmlFor="">{item.label}</label>
          {item.field=='input'?
          <Input name={item.name} required={item?.required} onChange={handleinputchange} />
        :item.field=='textarea'?
          <Textarea name={item.name} required={item?.required} onChange={handleinputchange}/>:null
        }
        
        </div>
      ))}
      <Button type='submit'  className='w-full  p-6'> Generate Content </Button>
       
         
     </form>
    </div>
  )
}

export default Formsection