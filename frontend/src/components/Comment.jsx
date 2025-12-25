
import { FaComments } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { getenv } from "@/helper/getenv";
import { showToast } from "@/helper/showtoast";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RouteSignin } from "@/helper/RouteName";
import CommentList from "./CommentList";



function Comment({props}) {
   const [newComment,setNewComment] = useState()
  const user = useSelector((state) => state.user)
    const formSchema = z.object({
        comment: z.string().min(3, { message: 'Comment must be at least 3 character long.' }),
       
    
      });
    
      // 🧠 Initialize react-hook-form with Zod
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          comment: "",
    
        },
      });
       async function onSubmit(values) {
         
          try {
            const newValues = {...values,blogid:props.blogid,author:user.user._id}
            const res = await fetch(`${getenv('VITE_API_BASE_URL')}/comment/add`, {
              method: 'post',
              credentials: 'include',
              headers: { 'Content-type': 'application/json' },
              body: JSON.stringify(newValues)
            })
            const data = await res.json()
            if (!res.ok) {
              return showToast('error', data.message)
            }
            setNewComment(data.comment)
            form.reset()
            showToast('success', data.message);
      
          }
          catch (err) {
      
            showToast('error', err.message);
          }
        };

  return (
    <div>
      <h4 className='flex items-center gap-2 text-2xl font-bold'> <FaComments className='text-violet-500'/> Comment </h4>

      {user && user.isLoggedIn ?
                  <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}  // ✅ This line is required
              className="w-full max-w space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                        <Textarea placeholder='Type your comments...' {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>

         : 
         <Button asChild><Link to={RouteSignin}>
           Sign In
         </Link></Button> 
        }
        <div>
          <CommentList props={{blogid: props.blogid, newComment}}/>
        </div>
    </div>
  )
}

export default Comment
