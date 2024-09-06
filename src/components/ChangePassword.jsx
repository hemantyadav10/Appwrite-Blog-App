import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useUpdatePassword } from '../lib/react-query/queries';
import { Button, Input } from './index'
import { PasswordIcon } from '../assets/index'

function ChangePassword() {
  const { register, handleSubmit, formState: { errors }, reset, clearErrors } = useForm();
  const updateMutation = useUpdatePassword();

  const onSubmit = (data) => {
    const { newPassword, currentPassword } = data;
    if (newPassword === currentPassword) {
      return toast.info('Both passwords are same.');
    }
    const id = toast.loading('Updating ...')
    updateMutation.mutate(
      { newPass: newPassword, oldPass: currentPassword },
      {
        onSuccess: () => {
          toast.update(id, { render: 'Password Updated.', isLoading: false, type: 'success', autoClose: 5000, closeOnClick:true });
          reset();
          clearErrors();
        },
        onError: (error) => {
          toast.update(id, { render: error.message, isLoading: false, type: 'error', autoClose: 5000, closeOnClick:true });
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full p-6 lg:px-8'
    >
      <div className='flex flex-col gap-6 sm:max-w-md'>
        <p className='font-medium color'>ChangePassword</p> 
        <Input
          type='password'
          placeholder='Current Password'
          icon={PasswordIcon}
          showPasswordToggle={true}
          error={errors.currentPassword}
          className='pr-10 rounded-lg'
          {...register('currentPassword', {
            required: 'Password is required.',
            minLength: {
              value: 8,
              message: 'Password must be atleast 8 character(s).'
            },
          })}
        />
        <Input
          type='password'
          placeholder='New Password'
          icon={PasswordIcon}
          showPasswordToggle={true}
          error={errors.newPassword}
          className='pr-10 rounded-lg'
          {...register('newPassword', {
            required: 'Password is required.',
            minLength: {
              value: 8,
              message: 'Password must be atleast 8 character(s).'
            },
            pattern: {
              value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+{};:,<.>])/,
              message: 'Password must contain at least one uppercase letter, one number, and one special character.'
            }
          })}
        />
        <Button
          type='submit'
          disabled={updateMutation.isPending}
          className='w-48 rounded-full'
        >
          Change Password
        </Button>
      </div>
    </form>
  )
}

export default ChangePassword
