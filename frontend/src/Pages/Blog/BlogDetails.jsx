import React, { useState } from 'react'
import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RouteBlogAdd, RouteBlogEdit } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getenv } from '@/helper/getenv'
import { deleteData } from '@/helper/handleDelete'
import { showToast } from '@/helper/showtoast'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import moment from 'moment'

function BlogDetails() {
     const [refreshData,setRefreshData] = useState(false)
    const {data: blogData,loading,error} = useFetch(`${getenv('VITE_API_BASE_URL')}/blog/get-all`,{
        method:'GET',
        credentials:'include'
    }, [refreshData])



    const handleDelete = (id) =>{
        const response = deleteData(`${getenv('VITE_API_BASE_URL')}/blog/delete/${id}`)
        if(response){
            setRefreshData(!refreshData)
            showToast('success','Data deleted.')
        }else{
            showToast('error','Data not deleted.')
        }
    }

     if(loading) return <Loading/>
  return (
    
    <div>
            <Card>
                <CardHeader>
                    <div>
                        <Button>
                            <Link to={RouteBlogAdd}> Add Blog</Link>

                        </Button>
                    </div>
                </CardHeader>
                <CardContent> <Table>
                    <TableHeader>

                        <TableRow>
                            <TableHead>
                                Auther
                            </TableHead>

                            <TableHead>
                                blog
                            </TableHead>
                            <TableHead>
                                Title
                            </TableHead>
                            <TableHead>
                                Slug
                            </TableHead>
                            <TableHead>
                                Dated
                            </TableHead>
                            <TableHead >
                                Action
                            </TableHead>


                        </TableRow>

                    </TableHeader>
                    <TableBody>
                      {Array.isArray(blogData) && blogData.length > 0 ? 
                      blogData.map(blog =>
                        <TableRow key={blog._id}>
                        <TableCell>
                           {blog?.author?.name}
                        </TableCell>
                        <TableCell>
                           {blog?.category?.name}
                        </TableCell>
                        <TableCell>
                           {blog?.title}
                        </TableCell>
                         <TableCell>
                           {blog?.slug}
                        </TableCell >
                         <TableCell>
                           {moment( blog?.createdAt).format('DD-MM-YYYY')}
                        </TableCell >
                         <TableCell className='flex gap-3'>
                           <Button variant='outline' className='hover:bg-violet-500 hover:text-white' asChild>
                            <Link to={RouteBlogEdit(blog._id)}><FiEdit /></Link>
                             
                           </Button>
                           <Button onClick={() => handleDelete(blog._id)} variant='outline' className='hover:bg-violet-500 hover:text-white'>
                           <FaRegTrashAlt /> 
                             
                           </Button>

                        </TableCell>
                      </TableRow>
                      )
                       :
                      <TableRow>
                        <TableCell colSpan='6'>
                           Data not found
                        </TableCell>
                      </TableRow>
                    }
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
  )
}

export default BlogDetails
