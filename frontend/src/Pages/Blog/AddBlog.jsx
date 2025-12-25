import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from '@/hooks/useFetch';
import Dropzone from 'react-dropzone';
import Editor from '@/components/Editor';
import { useSelector } from 'react-redux';
import { RouteBlog } from '@/helper/RouteName';
import { useNavigate } from 'react-router-dom';

function AddBlog() {
  const user = useSelector((state)=>state.user)
  const [filePreview, setPreview] = useState();
  const [file, setFile] = useState();
  const navigate = useNavigate()

  const { data: categoryData, loading, error } = useFetch(
    `${getenv('VITE_API_BASE_URL')}/category/all-category`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  const formSchema = z.object({
    category: z.string().min(1, { message: 'Please select a category' }),
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    slug: z.string().min(3, { message: "Slug must be at least 3 characters long." }),
    blogContent: z.string().min(3, { message: 'Blog Content must be at least 3 characters long' }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const blogTitle = form.watch('title');
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue('slug', slug);
    }
  }, [blogTitle]);

  async function onSubmit(values) {
  try {
    if (!file) {
      showToast('error', 'Featured image required');
      return; // ✅ Prevents submit
    }

    const newValues = { ...values, author: user.user._id };
    const formData = new FormData();
    formData.append('file', file); // ✅ File
    formData.append('data', JSON.stringify(newValues)); // ✅ Text data

    const res = await fetch(`${getenv('VITE_API_BASE_URL')}/blog/add/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      showToast('error', data.message || 'Something went wrong');
      return;
    }

    form.reset();
    setFile(null);
    setPreview(null);

    navigate(RouteBlog);
    showToast('success', 'Blog created successfully!');
  } catch (err) {
    showToast('error', err.message || 'Something went wrong');
  }
}


  const handleFileSelection = (files) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    const preview = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(preview);
  };

  return (
    <Card className='pt-5 max-w-screen-md mx-auto'>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-3xl space-y-6 bg-white p-6 rounded-lg"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Blog title" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading && <p>Loading categories...</p>}
                        {error && <p>Error loading categories</p>}
                        {categoryData?.category?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Blog Slug" {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feature Image */}
            <div className='mb-3'>
              <FormLabel>Feature Image</FormLabel>
              <Dropzone onDrop={handleFileSelection}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                      <img src={filePreview || '/placeholder.png'} alt="Preview" />
                    </div>
                  </div>
                )}
              </Dropzone>
            </div>

            {/* Blog Content */}
            <FormField
              control={form.control}
              name="blogContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Content</FormLabel>
                  <FormControl>
                    <div className='border rounded-md overflow-hidden'>
                      <Editor  onChange={(event, editor) => {
    const data = editor.getData(); // ✅ Safe, since editor is defined
    field.onChange(data);
  }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddBlog;