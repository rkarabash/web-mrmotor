import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Box, Stack, TextField, IconButton, Avatar, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function NewQuizForm() {
  const RegisterSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Too Short!').max(100, 'Too Long!').required('Title required'),
    description: Yup.string().min(2, 'Too Short!'),
    timer: Yup.number()
      .moreThan(2, 'Timer must be more than 2')
      .lessThan(10, 'Timer must be less then 10')
      .required('Timer is required')
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      decription: '',
      timer: 3
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {}
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={5}
            maxRows={10}
            {...getFieldProps('description')}
            error={Boolean(touched.description && errors.description)}
            helperText={touched.description && errors.description}
          />
          <TextField
            fullWidth
            select
            label="Timer"
            {...getFieldProps('timer')}
            error={Boolean(touched.timer && errors.timer)}
            helperText={touched.timer && errors.timer}
          >
            {Array.from({ length: 7 }, (_, i) => i + 3).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Next Step
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
