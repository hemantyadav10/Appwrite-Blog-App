import React from 'react'
import { MailIcon, PasswordIcon, UsernameIcon, ProfileIcon } from '../assets';
import { Link, useNavigate, } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input, Button, Loader } from './index'
import { useCheckUsernameUnique, useCreateUserAccount } from '../lib/react-query/queries';

import { toast } from 'react-toastify';

function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { mutate: signup, isPending: loading, } = useCreateUserAccount();
  const { mutateAsync: isUsernameUnique, isPending } = useCheckUsernameUnique();


  const onSubmit = async (data) => {
    const isUnique = await isUsernameUnique(data.username);

    if (isUnique.length !== 0) return toast.error('Username is already taken');

    signup(data, {
      onSuccess: () => {
        toast.success('Account created successfully.');
        navigate('/login');
      },
      onError: (error) => {
        console.log(error.message);
        toast.error(error.message);
      }
    })
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col w-full max-w-sm gap-6'
      >
      <div>
        <p className='text-3xl font-semibold color'>
          Create your Free Account
        </p>
      </div>
      <p className='text-sm medium_color'>
        Already have an account?
        <Link
          to='/login'
          className='ml-1 font-medium hover:underline colored'>
          Sign in here.
        </Link>
      </p>
      <Input
        placeholder='Name'
        icon={ProfileIcon}
        error={errors.name}
        {...register('name', {
          required: 'Name is required.',
          minLength: {
            value: 2,
            message: 'Name must have atleast 2 character(s).',
          }
        })}
        className={`rounded-lg`}
      />
      <Input
        placeholder='Username'
        icon={UsernameIcon}
        error={errors.username}
        {...register('username', {
          required: 'Username is required.',
          minLength: {
            value: 2,
            message: 'Name must have atleast 2 character(s).',
          }
        })}
        className={`rounded-lg`}
      />
      <Input
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
        className={`rounded-lg`}
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
            message: 'Password must be atleast 8 character(s)'
          },
          pattern: {
            value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+{};:,<.>])/,
            message: 'Password must contain at least one uppercase letter, one number, and one special character.'
          }
        })}
        className={`rounded-lg`}
      />
      <Button
        type='submit'
        disabled={loading || isPending}
        className={`w-full py-3 rounded-lg`}
      >
        {(loading || isPending) ? (
          <div className='flex items-center gap-2'>
            <div className='border-2 border-transparent rounded-full border-t-white size-4 border-r-white animate-customSpin'></div>
            Creating account
          </div>
        ) : 'Create Account'}
      </Button>
    </form>
  )
}

export default Signup;
