import React from 'react';
import { signInSchema } from './../../lib/schema';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useLoginMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useAuth } from '@/provider/auth-context';

type SignInFormdata = z.infer<typeof signInSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const {login} = useAuth();

  const form = useForm<SignInFormdata>({
    resolver: zodResolver(signInSchema)
  });

  const {mutate, isPending} = useLoginMutation();

  const handleOnSubmit = (values: SignInFormdata) => {
    mutate(values,{
      onSuccess: (data) => {
        login(data);
        console.log(data);
        toast.success("Login successful");
        navigate("/dashboard")
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error occured";
        console.log(error)
        toast.error(errorMessage);
      },
    })
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <CardHeader className="text-center mb-4">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="ml-1.2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
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
                   <div className='flex items-center justify-between'>
                     <FormLabel>Password</FormLabel>
                     <Link to="/forget-password" className='text-sm text-blue-600 hover:underline'>
                       Forgot Password?
                      </Link>
                   </div>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                Sign In
              </Button>
            </form>
          </Form>
          <CardFooter className='mt-4 text-center justify-center'>
                <div className='flex items-center justify-center'>
                  <p className='text-sm text-muted-foreground'>
                    Don't have an account? <Link to="/sign-up" className='text-primary hover:underline'>Sign Up</Link>
                  </p>
                </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
