import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getenv } from '@/helper/getenv';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/helper/showtoast';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from '@/hooks/useFetch';
import Loading from '@/components/Loading';
import { setUser } from '@/redux/user/user.slice';
import { RouteIndex } from '@/helper/RouteName';
import { IoCameraOutline } from "react-icons/io5";
import Dropzone from 'react-dropzone';

function Profile() {
    const [filePreview, setPreview] = useState();
    const [file, setFile] = useState();

    const user = useSelector((state) => state.user);
    const userId = user?.user?._id;

    const { data: userData, loading, error } = useFetch(
        `${getenv('VITE_API_BASE_URL')}/user/get-user/${userId}`,
        { method: 'GET', credentials: 'include' }
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters'),
        email: z.string().email('Invalid email'),
        bio: z.string().min(3, 'Bio must be at least 3 characters'),
        password: z.string().optional()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            bio: "",
            password: "",
        },
    });

    useEffect(() => {
        if (userData && userData.success) {
            form.reset({
                name: userData.user.name,
                email: userData.user.email,
                bio: userData.user.bio,
            });
        }
    }, [userData]);

    // File selection from Dropzone
    const handleFileSelection = (files) => {
        const selectedFile = files[0];
        if (!selectedFile) return;

        const preview = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setPreview(preview);
    };

    // Form submission
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            if (file) formData.append('file', file);
            formData.append('data', JSON.stringify(values));

            const res = await fetch(
                `${getenv('VITE_API_BASE_URL')}/user/update-user/${userData.user._id}`,
                {
                    method: 'PUT',
                    body: formData,
                    credentials: 'include', // ✅ No Content-Type, browser sets multipart/form-data
                }
            );

            const data = await res.json();

            if (!res.ok) {
                // Show backend message if exists
                showToast('error', data.message || 'Something went wrong');
                return;
            }

            dispatch(setUser(data.user));
            navigate(RouteIndex);
            showToast('success', 'Profile updated successfully!');
        } catch (err) {
            showToast('error', err.message || 'Something went wrong');
        }
    };

    if (loading) return <Loading />;

    return (
        <Card className='max-w-screen-md mx-auto'>
            <CardContent>
                <div className='flex justify-center items-center mt-10'>
                    <Dropzone onDrop={handleFileSelection}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className='w-20 h-20 relative group'>
                                    <AvatarImage
                                        src={filePreview || userData?.user?.avatar}
                                    />
                                    <div className='absolute z-50 w-full h-full top-0.5 left-0.5 -translate-x-0.5 -translate-y-0.5 justify-center items-center bg-white bg-opacity-20 border-2 border-violet-500 rounded-full group-hover:flex hidden cursor-pointer'>
                                        <IoCameraOutline className='text-violet-500 w-6 h-6' />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>
                </div>
            </CardContent>

            <div className='flex justify-center items-center'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-md"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter your bio" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Save</Button>
                    </form>
                </Form>
            </div>
        </Card>
    );
}

export default Profile;
