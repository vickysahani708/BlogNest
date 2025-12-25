import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getenv } from '@/helper/getenv'
import { RouteAddCategory, RouteEditCategory } from '@/helper/RouteName'
import { useFetch } from '@/hooks/useFetch'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { showToast } from '@/helper/showtoast'
import { deleteData } from '@/helper/handleDelete'


function CategoryDetails() {
    const [refreshData,setRefreshData] = useState(false)
    const {data: categoryData,loading,error} = useFetch(`${getenv('VITE_API_BASE_URL')}/category/all-category`,{
        method:'GET',
        credentials:'include'
    }, [refreshData])

    const handleDelete = (id) =>{
        const response = deleteData(`${getenv('VITE_API_BASE_URL')}/category/delete/${id}`)
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
                            <Link to={RouteAddCategory}> Add Category</Link>

                        </Button>
                    </div>
                </CardHeader>
                <CardContent> <Table>
                    <TableHeader>

                        <TableRow>

                            <TableHead>
                                Category
                            </TableHead>
                            <TableHead>
                                Slug
                            </TableHead>
                            <TableHead >
                                Action
                            </TableHead>


                        </TableRow>

                    </TableHeader>
                    <TableBody>
                       {categoryData && categoryData.category.length > 0 ? 
                      categoryData.category.map(category =>
                        <TableRow key={category._id}>
                        <TableCell>
                           {category.name}
                        </TableCell>
                         <TableCell>
                           {category.slug}
                        </TableCell >
                         <TableCell className='flex gap-3'>
                           <Button variant='outline' className='hover:bg-violet-500 hover:text-white' asChild>
                            <Link to={RouteEditCategory(category._id)}><FiEdit /></Link>
                             
                           </Button>
                           <Button onClick={() => handleDelete(category._id)} variant='outline' className='hover:bg-violet-500 hover:text-white'>
                           <FaRegTrashAlt /> 
                             
                           </Button>

                        </TableCell>
                      </TableRow>
                      )
                       :
                      <TableRow>
                        <TableCell colSpan='3'>
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

export default CategoryDetails
