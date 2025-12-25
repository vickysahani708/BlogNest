import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getenv } from '@/helper/getenv'
import { useFetch } from '@/hooks/useFetch'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SearchResult = () => {
   const [searchParams] = useSearchParams()
   const q= searchParams.get('q')
   const {data: blogData,loading,error} = useFetch(`${getenv('VITE_API_BASE_URL')}/blog/search?q=${q}`,{
          method:'GET',
          credentials:'include'
      },[q] )
       const blogs = blogData?.blog ?? []
      if(loading) return <Loading/>
  return (
   <>
    <div className='flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5'>
        
        <h4> Search Result For:{q}</h4>
    </div>
    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 p-6">
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard key={blog._id} props={blog} />
        ))
      ) : (
        <div className="col-span-3 text-center text-gray-500">
          Data not found
        </div>
      )}
    </div>
    </>
  )
}

export default SearchResult
