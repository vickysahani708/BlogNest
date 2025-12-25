import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/helper/RouteName'
function SearchBox() {
  const navigate = useNavigate()
  const[query,setQuery] = useState()
  const getInput = (e) => {
    setQuery(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(RouteSearch(query))


  }
  return (
    <form onSubmit={handleSubmit}>
        <Input name ='q' onChange = {getInput} placeholder="Search here..." className="h-9 w-50 rounded-full "/>
    </form>
  )
}

export default SearchBox
