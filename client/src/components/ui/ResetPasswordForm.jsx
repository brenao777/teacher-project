import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container } from 'react-bootstrap';

const ResetPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    alert(`Ссылка для восстановления доступа отправлена на вашу почту!: ${data.email}`);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Восстановление пароля</h1>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>
            <p>
              Введите вашу почту, связанную с аккаунтом. На неё будет выслана ссылка для
              сброса пароля.
            </p>
            <h5 className="mt-5">Email</h5>
          </Form.Label>
          <Form.Control
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/,
                message: 'Некорректный email',
              },
            })}
            type="email"
            isInvalid={!!errors.email}
            placeholder="Введите email"
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100 mt-2">
          Отправить код восстановления
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPasswordForm;
