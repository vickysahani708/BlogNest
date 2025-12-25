import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getenv } from '@/helper/getenv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'

function Index() {
  const {data: blogData,loading,error} = useFetch(`${getenv('VITE_API_BASE_URL')}/blog/blogs`,{
          method:'GET',
          credentials:'include'
      })

      if(loading) return <Loading/>
  return (
    
    <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'> 
  
       {blogData && blogData.length > 0 ?
  blogData.map(blog => <BlogCard  key={blog._id}  props={blog} />)
 :
  <div>Data not found</div>
}

 
    </div>
  )
}

export default Index;
