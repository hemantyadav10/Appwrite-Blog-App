import React, { useState } from 'react'
import { Button, Container, Input } from '../components'
import { useForm } from 'react-hook-form'
import { MailIcon } from '../assets/index'
import { account, appwriteConfig, databases } from '../lib/appwrite/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const emailFound = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('email', data.email)]
      );

      if (emailFound.total === 0) {
        throw new Error('Email not registered')
      }

      const resetUrl = import.meta.env.VITE_RESET_PASSWORD_URL;
      
      const result = await account.createRecovery(
        data.email,
        resetUrl
      );
      if (result) {
        toast.success('A reset link has been sent to your email.')
        reset();
      }

    } catch (error) {
      toast.error(error.message)
      console.error(error.message);
    } finally {
      setLoading(false)
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
              Enter the email associated with your account to recieve an email to reset your password
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
              className={` rounded-lg`}
            />
            <div className='space-y-2'>
              <Button
                type='submit'
                disabled={loading}
                className={`w-full py-3 rounded-lg `}
              >
                {loading ? 'Loading...' : 'Submit'}
              </Button>
              <Button
                variant='third'
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

export default ForgotPassword
