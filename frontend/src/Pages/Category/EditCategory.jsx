import React, { useEffect } from 'react'
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import slugify from 'slugify';
import { showToast } from '@/helper/showtoast';
import { getenv } from '@/helper/getenv';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';


function EditCategory() {
  const{category_id} = useParams()
  const{data:categoryData,loading,error}=useFetch(`${getenv('VITE_API_BASE_URL')}/category/show/${category_id}`,{
          method:'GET',
          credentials:'include'
      },[category_id])
  
  const formSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 character long.' }),
    slug: z.string().min(3, { message: "Slug must be at least 3 character long." }),

  });
  ;

  //  Initialize react-hook-form with Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",

    },
  });
  useEffect(() => {
    const categoryName = form.watch('name')
    if (categoryName) {
      const slug = slugify(categoryName, { lower: true })
      form.setValue('slug', slug)
    }
  })
 const categoryName = form.watch('name')
  useEffect(() => {
   
    if(categoryName){
      const slug = slugify(categoryName,{lower:true})
      form.setValue('slug',slug)
    }
  },[categoryName])

 
  useEffect(() => {
     
    if(categoryData){
    
      form.setValue('name',categoryData.category.name)
       form.setValue('slug',categoryData.category.slug)
      
    }
  },[categoryData])

  async function onSubmit(values) {
    console.log("Form submitted:", values);
    try {
      const res = await fetch(`${getenv('VITE_API_BASE_URL')}/category/update/${category_id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        return showToast('error', data.message)
      }
      showToast('success', data.message);

    }
    catch (err) {

      showToast('error', err.message);
    }
  };
  return (
    <div>
      <Card className='pt-5 max-w-screen-md mx-auto'>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}  // ✅ This line is required
              className="w-full max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-md"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Slug address..."
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>

        </CardContent>

      </Card>
    </div>



  )
}

export default EditCategory

