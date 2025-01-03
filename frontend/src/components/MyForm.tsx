import React from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  name: string;
  email: string;
}

const MyForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <input {...register('name')} type="text" placeholder="Name" className="border border-gray-300 p-2 rounded" />
      <input {...register('email')} type="email" placeholder="Email" className="border border-gray-300 p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default MyForm;
