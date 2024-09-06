import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/UserContext'
import {UsernameIcon, MailIcon, ProfileIcon} from '../assets/index'
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useCheckUsernameUnique, useUpdateAuthorDetails, useUpdateProfileImg } from '../lib/react-query/queries';
import { TextArea, Button, Input } from './index'

function EditProfile() {
  const { user, setUser } = useUserContext();
  const [bio, setBio] = useState(user.bio || '')
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      username: user.username,
    }
  });
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);
  const [image, setImage] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const { isPending: uploadingImg, mutate } = useUpdateProfileImg(user.id);
  const checkUsernameMutation = useCheckUsernameUnique();
  const updateMutation = useUpdateAuthorDetails(user.id);

  const handleImagePreview = (e) => {
    const file = e.target.files?.[0];
    setUpdatedProfileImg(file ? URL.createObjectURL(file) : undefined)
    setImage(file);
  }

  useEffect(() => {
    return () => {
      if (updatedProfileImg) {
        URL.revokeObjectURL(updatedProfileImg);
      }
    };
  }, [updatedProfileImg]);

  const handleUploadImage = () => {
    const id = toast.loading('Uploading...');
    setInputDisable(true);

    mutate({ userId: user.id, image, previousImageId: user.imageId },
      {
        onSuccess: (img) => {
          setUser((prev) => ({
            ...prev,
            imageId: img.imageId,
            imageUrl: img.imageUrl,
          }));

          localStorage.setItem('user', JSON.stringify({ ...user, imageId: img.imageId, imageUrl: img.imageUrl, }));

          setUpdatedProfileImg(null);
          toast.update(id, { render: 'Uploaded', type: 'success', isLoading: false, autoClose: 5000, closeOnClick:true });
        },
        onError: (error) => {
          toast.update(id, { render: error.message, type: 'error', isLoading: false, autoClose: 5000, closeOnClick:true });
        },
        onSettled: () => {
          setInputDisable(false);
        },
      }
    );
  };


  const onSubmit = async (data) => {
    const updatedFields = {};

    if (data.name.trim() !== user.name) {
      updatedFields.name = data.name.trim();
    }
    if (bio !== user.bio) {
      updatedFields.bio = bio;
    }
    if (data.username.trim() !== user.username) {
      updatedFields.username = data.username.trim();
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("Nothing to update");
      return;
    }

    let id = toast.loading('Updating...');
    setUpdatingProfile(true);

    try {
      if (updatedFields.username) {
        const isUnique = await checkUsernameMutation.mutateAsync(updatedFields.username);
        if (isUnique.length !== 0) {
          toast.update(id, { render: "Username is already taken.", type: "error", isLoading: false, autoClose: 5000, closeOnClick:true });
          setUpdatingProfile(false);
          return;
        }
      }

      updateMutation.mutate({ authorId: user.id, updatedFields }, {
        onSuccess: () => {
          const updatedUser = {
            ...user,
            ...updatedFields,
          };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));

          toast.update(id, { render: "Updated Successfully", type: "success", isLoading: false, autoClose: 5000, closeOnClick:true });
        },
        onError: (error) => {
          console.error(error);
          toast.update(id, { render: error.message, type: "error", isLoading: false, autoClose: 5000, closeOnClick:true });
        },
        onSettled: () => {
          setUpdatingProfile(false);
        },
      });
    } catch (error) {
      console.error(error);
      toast.update(id, { render: error.message, type: "error", isLoading: false, autoClose: 5000, closeOnClick:true });
      setUpdatingProfile(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col w-full p-6 pb-24 lg:pr-28 lg:pl-8'
    >
      <p className='font-medium color'>
        Edit Profile
      </p>
      <div className='flex flex-col w-full gap-6 pt-10 '>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-8'>
          <div className='flex flex-col items-center gap-4'>
            <div>
              <label htmlFor='upload_dp' className={`cursor-pointer relative rounded-full ${inputDisable ? 'cursor-auto' : ' cursor-pointer '} w-24 h-24 group`}>
                <div className={`absolute inset-0 flex text-xs font-semibold items-center justify-center text-white transition-opacity rounded-full opacity-0 bg-black/70 dark:bg-black/60 group-hover:opacity-100 ${inputDisable && 'hidden'}`}>Upload Image</div>
                <img
                  alt='profile_image'
                  src={updatedProfileImg || user.imageUrl}
                  className='object-cover object-center rounded-full size-24'
                />
                <input
                  onChange={handleImagePreview}
                  type="file"
                  hidden={true}
                  disabled={inputDisable}
                  id='upload_dp'
                  accept='.jpg, .jpeg, .png'
                />
              </label>
            </div>
            <Button
              onClick={handleUploadImage}
              disabled={uploadingImg || !updatedProfileImg}
              variant='secondary'
              className='px-8 text-xs rounded-md'
            >
              Upload
            </Button>
          </div>
          <div className='flex flex-col w-full gap-4 '>
            <div className='flex flex-col w-full gap-4 md:flex-row'>
              <Input
                placeholder='Name'
                icon={ProfileIcon}
                error={errors.name}
                className={`rounded-lg capitalize `}
                {...register('name', {
                  required: 'Name is required.',
                  minLength: {
                    value: 2,
                    message: 'Name must have atleast 2 character(s).',
                  }
                })}
              />
              <Input
                value={user.email}
                placeholder='Email'
                icon={MailIcon}
                disabled={true}
                className='rounded-lg '
                divClassName = 'opacity-60'
              />
            </div>
            <div className='flex flex-col w-full gap-1 '>
              <Input
                icon={UsernameIcon}
                placeholder='Username'
                error={errors.username}
                className={`rounded-lg `}
                {...register('username', {
                  required: 'Username is required.',
                  minLength: {
                    value: 2,
                    message: 'Username must have atleast 2 character(s).',
                  }
                })}
              />
              <p className='text-sm light_color'>
                Username will be used to search users and will be visible to all users.
              </p>
            </div>
            <div className='w-full'>
              <TextArea
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength='150'
                rows={5}
                placeholder='Bio'
                className='dark:bg-[#21262d] bg-gray-100'
              />
              <p className='text-sm light_color '>
                {150 - bio.length} characters left
              </p>
            </div>
            <div>
              <Button
                type='submit'
                disabled={Object.keys(errors).length > 0 || updatingProfile}
                className='w-full px-12 rounded-full sm:w-max'
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default EditProfile

