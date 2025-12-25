import Loading from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { getenv } from '@/helper/getenv'
import { useFetch } from '@/hooks/useFetch'
import React, { useState } from 'react'
import { FaRegTrashAlt } from "react-icons/fa"
import { showToast } from '@/helper/showtoast'
import { deleteData } from '@/helper/handleDelete'
import usericon from '@/assets/images/user_icon.svg'
import moment from 'moment';
function Users() {
  const [refreshData, setRefreshData] = useState(false)

  const { data, loading, error } = useFetch(
    `${getenv('VITE_API_BASE_URL')}/user/get-all-user`,
    {
      method: 'GET',
      credentials: 'include'
    },
    [refreshData]
  )


  const handleDelete = async (id) => {
    const response = await deleteData(`${getenv('VITE_API_BASE_URL')}/user/delete/${id}`)
    if (response) {
      setRefreshData(!refreshData)
      showToast('success', 'Comment deleted.')
    } else {
      showToast('error', 'Failed to delete comment.')
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {data && data.user.length > 0 ? (
                    data.user.map((user) => (
                    <TableRow key={user._id}>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <img src={user.avatar  || usericon} className='h-10 w-10 rounded-full'/>
                        </TableCell>
                        <TableCell>{moment(user.createdAt).format('DD-MM-YYYY')}</TableCell>

                        <TableCell>
                        <Button
                            onClick={() => handleDelete(user._id)}
                            variant="outline"
                            className="hover:bg-violet-500 hover:text-white"
                        >
                            <FaRegTrashAlt />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan="5" className="text-center text-gray-500">
                        No comments found
                    </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Users
