import React from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card } from "@/components/ui/card";
import { RouteSignin } from "@/helper/RouteName";
import { getenv } from '@/helper/getenv';
import { showToast } from '@/helper/showtoast';
import GoogleLogin from '@/components/GoogleLogin';



function SignUp() {
  const navigate = useNavigate()

  const formSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 character long.' }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
  ;

  // 🧠 Initialize react-hook-form with Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  //  Handle form submission
  async function onSubmit(values) {
    try {
      const res = await fetch(`${getenv('VITE_API_BASE_URL')}/auth/signup`, {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
       if (res.status === 409) {
        showToast('Error', 'Email has already registered');
      } else if (res.status === 400) {
        showToast('Error', data.message || 'Invalid email or password');

        } else {
          showToast( 'Signup failed');
        }
      }
       navigate(RouteSignin);
       showToast('Signin successful');

    }
    catch (err) {

     showToast('Error', data.message);
    }
    // TODO: Add login logic here (e.g., API call, toast feedback)
  };
  return (
    <div className="flex items-center justify-center h-screen w-screen ">
      {/* Pass form context into <Form> */}
      <Card className='w-[400px] p-5'>
        <h1 className="text 2xl font-bold text-center mb-5">Create Your Account</h1>
        <div className=''>
          <GoogleLogin/>
          <div className='border my-5 flex justify-center items-center'>
            <span className='absolute bg-white text-sm'>
              Or
            </span>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-6 bg-white p-6 rounded-lg shadow-md"
          >
            {/* 📧 Email Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      type="name"
                    />
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
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*  Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter again your password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5">
              {/*  SignUp Button */}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="mt-5 text-sm flex justify-center items-center gap-2">
                <p>Already have Account?</p>
                <Link to={RouteSignin} className='text-blue-500 hover:underline'>Sign In</Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>

    </div>
  )
}

export default SignUp
