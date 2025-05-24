"use client"
import React, { useState } from 'react'
import SearchSection from './_component/Searchsection'
import TempletlistSection from './_component/Templetelistsection'

const Dashboard = () => {
  const [userSearchInput, setUserSearchInput] = useState<string>()
  return (
    <div>
      {/* search section */}
       <SearchSection onSearchInput={(value:string)=>setUserSearchInput(value)} />
       
      {/* templet list section */}
      <TempletlistSection userSearchInput={userSearchInput} />

      {/* templet detail section */}
    </div>
  )
}

export default Dashboard