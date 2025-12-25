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

function Comments() {
  const [refreshData, setRefreshData] = useState(false)

  const { data, loading, error } = useFetch(
    `${getenv('VITE_API_BASE_URL')}/comment/get-all-comment`,
    {
      method: 'GET',
      credentials: 'include'
    },
    [refreshData]
  )

  const handleDelete = async (id) => {
    const response = await deleteData(`${getenv('VITE_API_BASE_URL')}/comment/delete/${id}`)
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
                <TableHead>Blog</TableHead>
                <TableHead>Commented by</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.comments.length > 0 ? (
                data.comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell>{comment?.blogid?.title || 'N/A'}</TableCell>
                    <TableCell>{comment?.author?.name || 'Anonymous'}</TableCell>
                    <TableCell>{new Date(comment.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{comment?.comment}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleDelete(comment._id)}
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

export default Comments
