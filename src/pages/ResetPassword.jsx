import React, { useEffect, useState } from 'react'
import { Button, Container, Input } from '../components'
import { useForm } from 'react-hook-form'
import { PasswordIcon } from '../assets/index'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { account } from '../lib/appwrite/config';

function ResetPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId')
  const secretKey = String(searchParams.get('secret'));
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) return toast.error('Passwords do not match')
    setLoading(true);
    try {
      const result = await account.updateRecovery(
        userId,
        secretKey,
        data.newPassword
      );

      if (result) {
        toast.success('Password Reset Successfully');
        reset();
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.message)
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCanceClick = () => navigate('/login');


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <div className='flex items-center justify-center flex-1 w-full p-8'>
          <div className='w-full max-w-sm space-y-6 color'>
            <p className='text-3xl font-semibold'>
              Reset Password
            </p>
            <p className='text-sm medium_color'>
              Create a new password for your account
            </p>
            <Input
              type='password'
              placeholder='Password'
              icon={PasswordIcon}
              showPasswordToggle={true}
              autoFocus
              error={errors.newPassword}
              {...register('newPassword', {
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
              className={`pr-10 rounded-lg`}
            />
            <Input
              type='password'
              placeholder='Password'
              icon={PasswordIcon}
              showPasswordToggle={true}
              error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Password is required.',
                minLength: {
                  value: 8,
                  message: 'Password must be atleast 8 character(s).'
                },
              })}
              className={`pr-10 rounded-lg`}
            />

            <div className='space-y-2'>
              <Button
                type='submit'
                disabled={loading}
                className={`w-full py-3 rounded-lg ${loading && 'cursor-progress'}`}
              >
                Submit
              </Button>
              <Button
                variant='third'
                disabled={loading}
                onClick={handleCanceClick}
                className='w-full py-3 rounded-lg'
              >
                Cancel
              </Button>
            </div>

          </div>
        </div>
      </Container>

    </form>

  )
}

export default ResetPassword
