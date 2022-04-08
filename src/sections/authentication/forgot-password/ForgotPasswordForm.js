import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formik.values.email
        })
      };
      fetch('https://mrmotor.herokuapp.com/users/forgot_password', requestOptions)
        .then(async (response) => {
          const data = await response.text();
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = response.statusText;
            return Promise.reject(error);
          }
          alert(data);
          navigate('/app/home', { replace: true });
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3} mb={2}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send verification email
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
