import { getenv } from '@/helper/getenv';
import { useFetch } from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { FaHeart } from "react-icons/fa";
import Loading from './Loading';
import { useSelector } from 'react-redux';
import { showToast } from '@/helper/showtoast';

function Like({ props }) {
  const [likeCount, setlikeCount] = useState(0)
  const [hasLiked, sethasLiked] = useState(false)
  const user = useSelector(state => state.user)
  const url = `${getenv('VITE_API_BASE_URL')}/like/get-like/${props.blogid}`;
  const urlWithUser = user && user.isLoggedIn ? `${url}?userid=${user.user._id}` : url;

  const { data: blogLikeCount, loading, error } = useFetch(urlWithUser, {
    method: 'GET',
    credentials: 'include'

  });

  useEffect(() => {
    if (blogLikeCount) {
      setlikeCount(blogLikeCount.likecount)
      sethasLiked(blogLikeCount.isUserliked)
    }
  }, [blogLikeCount])

  const handlelike = async () => {
    try {
      if (!user.isLoggedIn) {
        return showToast('error', "Please login into your account.")
      }
      const response = await fetch(`${getenv('VITE_API_BASE_URL')}/like/do-like`, {
        method: 'Post',
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ userid: user.user._id, blogid: props.blogid })

      })
      if (!response.ok) {
        showToast('error', response.statusText)
      }
      const responseData = await response.json()
      setlikeCount(responseData.likecount)
      sethasLiked(!hasLiked)
    } catch (error) {
      showToast('error',error.message)
    }
  }
  if (loading) return <Loading />
  return (
    <button onClick={handlelike} type='button' className='flex justify-between items-center gap-2'>
      {!hasLiked ?
        <FaHeart />
        :
        <FaHeart color='red' />
      }
      {likeCount}
    </button>
  )
}

export default Like
