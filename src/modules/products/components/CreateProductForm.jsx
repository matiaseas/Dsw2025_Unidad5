import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';
import toast from 'react-hot-toast';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      cui: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    try {
      await createProduct(formData);

      toast.success('Producto creado exitosamente.', { duration: 3000 });
      navigate('/admin/products');
    } catch (error) {
      if (error.response?.data?.detail) {
        const errorMessage = frontendErrorMessage[error.response.data.code];

        setErrorBackendMessage(errorMessage);
      } else {
        setErrorBackendMessage('Contactar a Soporte');
      }
    }
  };

  return (
    <Card className='xl:w-[80%] xl:mx-auto'>
      <form
        className='
          flex
          flex-col
          gap-1
          p-8
          sm:gap-3
        '
        onSubmit={handleSubmit(onValid)}
      >
        <Input
          label='SKU'
          placeholder='Ej: SKU-1001'
          error={errors.sku?.message}
          {...register('sku', {
            required: 'SKU es requerido',
            pattern: {
              value: /^SKU\d+$/,
              message: 'El SKU debe comenzar con "SKU-" y continuar con números',
            },
          })}
          className='h-10'
        />
        <Input
          label='Código Único'
          placeholder='Ej: CUI-789'
          error={errors.cui?.message}
          {...register('cui', {
            required: 'Código Único es requerido',
          })}
          className='h-10'
        />
        <Input
          label='Nombre'
          placeholder='Ej: Tarjeta de Video RTX 4060'
          error={errors.name?.message}
          {...register('name', {
            required: 'Nombre es requerido',
          })}
          className='h-10'
        />
        <Input
          label='Descripción'
          placeholder='Ej: Modelo actualizado. Edición 2024.'
          {...register('description')}
          className='h-10'
        />
        <Input
          label='Precio'
          placeholder='Ej: 150000'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            min: {
              value: 1,
              message: 'No puede tener un precio negativo ni ser 0',
            },
          })}
          className='h-10 text-base'
        />
        <Input
          label='Stock'
          placeholder='Ej: 50'
          error={errors.stock?.message}
          {...register('stock', {
            min: {
              value: 0,
              message: 'No puede tener un stock negativo',
            },
          })}
          className='h-10 text-base'
          type='number'
        />
        <div className='sm:text-end'>
          <Button type='submit' className='w-full sm:w-fit'><p className='text-base'>Crear Producto</p></Button>
        </div>
        {errorBackendMessage && <span className='text-red-500'>{errorBackendMessage}</span>}
      </form>
    </Card>
  );
};

export default CreateProductForm;
