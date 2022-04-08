import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Box, Stack, TextField, IconButton, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export default function UpdateForm() {
  const user = JSON.parse(localStorage.getItem('user'));
  let image = '';
  if (user.avatar === '') image = '/static/profile-user.png';
  else image = user.avatar;
  const [fieldValue, setFieldValue] = useState(image);
  const RegisterSchema = Yup.object().shape({
    nname: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required')
  });
  const formik = useFormik({
    initialValues: {
      nname: user.name
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      let avatar;
      if (fieldValue === '/static/profile-user.png') avatar = '';
      else avatar = fieldValue;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({
          name: formik.values.nname,
          email: user.email,
          avatar: avatar
        })
      };
      fetch('https://mrmotor.herokuapp.com/users', requestOptions)
        .then(async (response) => {
          const data = await response.json();
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          localStorage.setItem('user', JSON.stringify(data));
          window.location.reload(false);
        })
        .catch((error) => {
          console.error('There was an error!', error);
          alert('Wrong data inputed!');
          window.location.reload(false);
        });
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box sx={{ position: 'relative', paddingTop: '10px' }}>
            <Avatar src={fieldValue} sx={{ width: 120, height: 120, margin: '0 auto' }} />
            <IconButton
              variant="contained"
              component="label"
              sx={{ backgroundColor: '#636E72', position: 'absolute', top: 0, right: '37%' }}
            >
              <Icon icon="akar-icons:edit" color="#FDCB6E" />
              <input
                name="avatar"
                accept="image/*"
                id="contained-button-file"
                type="file"
                hidden
                onChange={(e) => {
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    if (fileReader.readyState === 2) {
                      setFieldValue(fileReader.result);
                    }
                  };
                  fileReader.readAsDataURL(e.target.files[0]);
                }}
              />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Name"
            {...getFieldProps('nname')}
            error={Boolean(touched.nname && errors.nname)}
            helperText={touched.nname && errors.nname}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Update information
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
