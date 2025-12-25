import React from 'react'
import { Card, CardContent } from './ui/card'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { FaRegCalendarAlt } from "react-icons/fa";
import usericon from '@/assets/images/user_icon.svg'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteBlogDetails } from '@/helper/RouteName'
const BlogCard = ({props}) => {
    

  return (
    <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
      <Card className='pt-5'>
        <CardContent>
            <div className='flex items-center justify-between'>
             <div className='flex items-center justify-between gap-2' >
                <Avatar>
                    <AvatarImage src = {props.author.
avatar || usericon}   className="w-10 h-10 rounded-full object-cover"
/>

                </Avatar>
                <span>{props.author.name}</span>
            </div>
                {props.author.role === 'admin' &&
                
                
                <Badge variant='outline' className='bg-violet-500'>Admin</Badge>
        
                }
           
            </div>
            <div className='my-2'>
              <img src={props.featuredImage} className='flex justify-center items-center w-66 h-48 border-2  rounded'/>
            </div>
            <div>
                <p className='flex items-center gap-2 mb-2 '>
                    <FaRegCalendarAlt />
             <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                </p>
                <h2 className='text-2xl font-bold line-clamp-2'>{props.title}</h2>
             
            </div>
            

        </CardContent>
    </Card>
    </Link>
  
  )
}

export default BlogCard
