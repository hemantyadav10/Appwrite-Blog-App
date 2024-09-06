import React, { useCallback } from 'react'
import { MailIcon, PasswordIcon } from '../assets/index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useUserContext } from '../context/UserContext';
import { toast } from 'react-toastify';
import { Input, Button } from '../components/index'
import { useSignInAccount } from '../lib/react-query/queries';

function Login() {
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutateAsync: signInAccount, isPending: isLoading } = useSignInAccount();
  const { state } = useLocation();

  const onSubmit = useCallback(async (data) => {
    signInAccount(data, {
      onSuccess: async () => {
        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
          if (state) {
            navigate(`/blog/${state}`, { state: 'hello' });
            toast.success('Login Successful');
          } else {
            toast.success('Login Successful');
            navigate('/');
          }
        } else {
          toast.error("Login failed. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  }, [signInAccount, checkAuthUser, navigate, state]);

  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col w-full max-w-sm gap-6 '
    >
      <div>
        <p className='text-3xl font-semibold color'>
          Welcome Back
        </p>
      </div>
      <p className='text-sm medium_color'>
        Don't have an account?
        <Link
          to='/signup'
          className='ml-1 font-medium hover:underline colored'
        >
          Sign up.
        </Link>
      </p>
      <Input
        type="email"
        placeholder='Email'
        icon={MailIcon}
        error={errors.email}
        {...register('email', {
          required: 'Email is required.',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Invalid Email.',
          }
        })}
        autoFocus
        className={` rounded-lg `}
      />
      <Input
        type='password'
        placeholder='Password'
        icon={PasswordIcon}
        showPasswordToggle={true}
        error={errors.password}
        {...register('password', {
          required: 'Password is required.',
          minLength: {
            value: 8,
            message: 'Password must be atleast 8 character(s).'
          },
        })}
        className={`pr-10 rounded-lg`}
      />
      <Link
        to='/forgot-password'
        className='text-sm font-medium hover:underline colored w-max'
      >
        Forgot Password?
      </Link>
      <Button
        type='submit'
        disabled={isLoading}
        className={`w-full py-3 rounded-lg `}
      >
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <div className='border-2 border-transparent rounded-full border-t-white size-4 border-r-white animate-customSpin'></div>
            Signing in
          </div>) : 'Sign in to your account'
        }
      </Button>
    </form>
  )
}

export default Login


