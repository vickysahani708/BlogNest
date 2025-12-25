import { getenv } from '@/helper/getenv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import usericon from '@/assets/images/user_icon.svg';
import { useSelector } from 'react-redux';

function CommentList({ props }) {
  const user = useSelector((state) => state.user);
  const blogid = props.blogid;

  const { data, loading, error } = useFetch(
    `${getenv('VITE_API_BASE_URL')}/comment/get/${blogid}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div>
      <h4 className="text-2xl font-bold mt-5">
        {props.newComment
          ? data && data.comments.length + 1
          : data && data.comments.length}{' '}
        Comments
      </h4>

      <div className="mt-5 flex flex-col gap-6">
        {/* Render newly added comment first if available */}
        {props.newComment && (
          <div className="flex gap-4 items-start">
            <Avatar>
              <AvatarImage
                src={user?.user?.avatar || usericon}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Avatar>
            <div>
              <p className="font-semibold">{user?.user?.name || 'Anonymous'}</p>
              <p className="text-gray-700">{props.newComment.comment}</p>
              <div className="pt-2 text-sm gap-5 text-gray-500">
                {new Intl.DateTimeFormat('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }).format(new Date(props.newComment.createdAt || Date.now()))}
              </div>
            </div>
          </div>
        )}

        {/* Render existing comments from DB */}
        {data &&
          data.comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 items-start">
              <Avatar>
                <AvatarImage
                  src={comment.author?.avatar || usericon}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Avatar>
              <div>
                <p className="font-semibold">{comment.author?.name || 'Anonymous'}</p>
                <p className="text-gray-700">{comment.comment}</p>
                <div className="pt-2 text-sm text-gray-500">
                  {new Intl.DateTimeFormat('en-IN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(comment.createdAt))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default CommentList;
