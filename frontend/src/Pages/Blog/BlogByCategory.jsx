import React from 'react'
import { useParams } from 'react-router-dom'
import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getenv } from '@/helper/getenv'
import { useFetch } from '@/hooks/useFetch'
import { BiCategory } from "react-icons/bi";
function BlogByCategory() {
  const { category } = useParams()

  const { data: blogData, loading, error } = useFetch(
    `${getenv('VITE_API_BASE_URL')}/blog/get-blog-by-category/${category}`,
    {
      method: 'GET',
      credentials: 'include'
    }, [category]
  )

  if (loading) return <Loading />

  if (error) return <div className="text-red-500">Error loading blogs.</div>

  const blogs = blogData?.blog ?? []  // Safely access blogs array

  return (
    <>
    <div className='flex items-center gap-3 text-2xl font-bold text-violet-500 border-b pb-3 mb-5'>
        <BiCategory/>
        <h4>{blogData && blogData.categoryData?.name}</h4>
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

export default BlogByCategory
