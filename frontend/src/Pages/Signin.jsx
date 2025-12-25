import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Link,useNavigate} from 'react-router-dom'
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
import { RouteIndex,RouteSignUp } from "@/helper/RouteName";
import { showToast } from '@/helper/showtoast';
import { getenv } from '@/helper/getenv';
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import GoogleLogin from '@/components/GoogleLogin';
import logo from '@/assets/images/logo.png'

const  Signin = () => {
   const navigate = useNavigate()
   const dispath = useDispatch()
   const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(3, { message: "Password required" }),
  });

  // 🧠 Initialize react-hook-form with Zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 🚀 Handle form submission
async function onSubmit(values) {
  try {
    const res = await fetch(`${getenv('VITE_API_BASE_URL')}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 400 || res.status === 404) {
        showToast('error', data.message || 'Invalid email or password')}
        else {
        showToast('error', data.message || 'Signin failed');
      }
      return;
    }

    dispath(setUser(data.user))
    navigate(RouteIndex);
    showToast('success', 'Signin successful');
  } catch (err) {
    showToast('error', err.message || 'Something went wrong');
  }
};


  return (
    <div className="flex items-center justify-center h-screen w-screen ">
      {/* ✅ Pass form context into <Form> */}
      <Card className='w-[400px] p-5'>
        <div className="flex justify-center item-center mb-2">
        <Link to={RouteIndex}>
        <img src={logo}  alt="Logo" className="h-20 w-20"/>
        </Link>
        </div>
        <h1 className="text 2xl font-bold text-center mb-5">Login Into Account</h1>
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

          {/* 🔒 Password Field */}
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
          <div className="mt-5">
          {/* 🎯 Submit Button */}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          <div className="mt-5 text-sm flex justify-center items-center gap-2">
            <p>Don&apos;t have Account?</p>
            <Link to={RouteSignUp} className='text-blue-500 hover:underline'>Sign Up</Link>
          </div>
          </div>
        </form>
      </Form>
      </Card>
      
    </div>
  );
}
export default Signin