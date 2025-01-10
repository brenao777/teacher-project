import { useForm, Controller } from 'react-hook-form';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ loginHandler }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    loginHandler(data);
    reset();
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 border rounded bg-light">
            <h1 className="text-center mb-4">Вход в систему</h1>
            <Form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-z]{2,3}$/gm,
                    message: 'Некорректный email',
                  },
                }}
                render={({ field }) => (
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      {...field}
                      type="email"
                      isInvalid={!!errors.email}
                      placeholder="Введите email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Пароль обязателен',
                }}
                render={({ field }) => (
                  <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                      {...field}
                      type="password"
                      isInvalid={!!errors.password}
                      placeholder="Введите пароль"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
              />

              <Button type="submit" variant="primary" className="w-100 mt-2">
                Войти
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-100 mt-2"
                onClick={() => navigate('/reset-password')}
              >
                Забыли пароль?
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
