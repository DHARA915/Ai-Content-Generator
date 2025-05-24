import { UserProfile } from '@clerk/nextjs'
import React from 'react'

const settings = () => {
  return (
    <div className='p-5 items-center flex justify-center xl:w-full lg:w-[650px]'>
        <UserProfile 
         appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full max-w-full shadow-none',
             
            }
          }}
          />
    </div>
  )
}

export default settings