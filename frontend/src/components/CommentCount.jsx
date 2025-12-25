import { getenv } from '@/helper/getenv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { FaRegComments } from "react-icons/fa";


const CommentCount = ({props}) => {
    const { data, loading, error } = useFetch(
        `${getenv('VITE_API_BASE_URL')}/comment/get-count/${props.blogid}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      if(loading) return 
  return (
    <button type='button' className='flex justify-between items-center gap-2'>
        <FaRegComments/>
        {data && data.commentCount}
    </button>
  )
}

export default CommentCount
