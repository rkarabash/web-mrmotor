import * as Yup from 'yup';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  Modal,
  IconButton,
  Switch,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

// ----------------------------------------------------------------------
const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function NewQuizForm() {
  const navigate = useNavigate();
  const [quizId, setQuizId] = useState(-1);
  const state = useLocation();
  const [secondStep, setSecondStep] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);
  const RegisterSchema = Yup.object().shape({
    title: Yup.string().min(2, 'Too Short!').max(100, 'Too Long!').required('Title required'),
    description: Yup.string().min(10, 'Too Short!').required('Description is required!'),
    timer: Yup.number()
      .moreThan(2, 'Timer must be more than 2')
      .lessThan(10, 'Timer must be less then 10')
      .required('Timer is required')
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      timer: 3
    },
    validationSchema: RegisterSchema,
    onSubmit: () => {
      setTitle(formik.values.title);
      setDescription(formik.values.description);
      setTimer(formik.values.timer);
      setSecondStep(true);
    }
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  if (!editMode && state.state !== null) {
    setEditMode(true);
    const { mquiz } = state.state;
    setQuizId(mquiz.id);
    formik.values.title = mquiz.title;
    formik.values.description = mquiz.description;
    formik.values.timer = mquiz.timer;
    setQuestions(mquiz.quizItems);
  }
  const editQuestion = (qid) => {
    setEdit({ qid, ...questions[qid] });
  };
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((item, index) => index !== id));
  };
  const saveQuiz = () => {
    const quizData = { title, description, timer, quizItems: questions };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      },
      body: JSON.stringify(quizData)
    };
    fetch('https://mrmotor.herokuapp.com/quiz', requestOptions)
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        navigate('/app/myquizzes', { replace: true });
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  const editQuiz = () => {
    setEditMode(false);
    setQuizId(-1);
    const quizData = { title, description, timer, quizItems: questions };
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      },
      body: JSON.stringify(quizData)
    };
    fetch(`https://mrmotor.herokuapp.com/quiz/update?id=${quizId}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        navigate('/app/myquizzes', { replace: true });
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };
  if (!secondStep) {
    return (
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={2} style={{ marginTop: '50px' }}>
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
  if (secondStep && !saving) {
    return (
      <Stack>
        <Button
          variant="contained"
          style={{ marginTop: '20px' }}
          disabled={questions.length === 0}
          onClick={() => {
            setSaving(true);
            if (editMode) {
              editQuiz();
            } else {
              saveQuiz();
            }
          }}
        >
          {editMode ? 'Edit Quiz' : 'Save Quiz'}
        </Button>
        <div
          style={{
            width: '100%',
            backgroundColor: '#636E72',
            margin: '20px 0 30px',
            fontSize: 0,
            height: '8px',
            borderRadius: '10px'
          }}
        >
          s
        </div>
        <Box
          style={{
            width: '100%',
            border: '3px solid #FDCB6E',
            borderRadius: '15px',
            padding: '10px'
          }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            style={{ marginBottom: '25px', marginTop: '25px' }}
          >
            {questions.length === 0 ? 'No questions for this quiz' : 'Add another one question'}
          </Typography>
          <Button variant="outlined" style={{ width: '100%' }} onClick={() => setOpen(true)}>
            Add new question
          </Button>
        </Box>
        {questions.map((item, index) => (
          <Box
            style={{
              width: '100%',
              border: '3px solid #FDCB6E',
              borderRadius: '15px',
              padding: '10px',
              marginTop: '15px',
              position: 'relative'
            }}
            key={index}
          >
            <div
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                position: 'absolute',
                border: '2px solid #FDCB6E',
                textAlign: 'center',
                paddingTop: '4px',
                fontWeight: 'bold',
                wordWrap: 'break-word'
              }}
            >
              {index + 1}
            </div>
            <Typography
              variant="h3"
              textAlign="center"
              noWrap="false"
              style={{ marginBottom: '25px', marginTop: '35px' }}
            >
              {item.question}
            </Typography>
            <Button
              variant="outlined"
              style={{ width: '100%' }}
              onClick={() => editQuestion(index)}
            >
              Edit question
            </Button>
            <Button
              variant="outlined"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => deleteQuestion(index)}
            >
              Delete question
            </Button>
          </Box>
        ))}
        <QuestionMenu
          open={open}
          setOpen={setOpen}
          questions={questions}
          setQuestions={setQuestions}
          setEdit={setEdit}
          edit={edit}
        />
      </Stack>
    );
  }
  if (saving) {
    return (
      <Box sx={{ margin: '40% auto' }}>
        <img
          src="/static/spinner.gif"
          alt="spinner"
          style={{ width: '150px', margin: '5px auto' }}
        />
        <Typography variant="h3">Saving quiz...</Typography>
      </Box>
    );
  }
}

function QuestionMenu({ open, setOpen, questions, setQuestions, setEdit, edit }) {
  const { height, width } = useWindowDimensions();
  const [fieldValue, setFieldValue] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [ans, setAnswer] = useState('');
  const [correct, setCorrect] = useState(false);
  const [answerMode, setAnswerMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [ind, setInd] = useState(-1);
  const [flag, setFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [qid, setQid] = useState(-1);
  const CoverImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    borderRadius: '15px',
    border: '2px solid #FDCB6E'
  });
  const AddAnswerSchema = Yup.object().shape({
    answer: Yup.string().required('Answer required')
  });
  const addAnswerFormik = useFormik({
    initialValues: {
      answer: '',
      isCorrect: false
    },
    validationSchema: AddAnswerSchema,
    onSubmit: (values, { resetForm }) => {
      if (editMode && ind !== -1) {
        const tmp = answers;
        tmp[ind].answer = addAnswerFormik.values.answer;
        tmp[ind].isCorrect = correct;
        setAnswers(tmp);
        setEditMode(false);
        setInd(-1);
      } else {
        setAnswers([...answers, { answer: addAnswerFormik.values.answer, isCorrect: correct }]);
      }
      setAnswer('');
      setCorrect(false);
      setAnswerMode(false);
      resetForm({
        values: {
          answer: '',
          isCorrect: false
        }
      });
    }
  });
  const AddQuestionSchema = Yup.object().shape({
    question: Yup.string().required('Question required')
  });
  const addQuestionFormik = useFormik({
    initialValues: {
      question: ''
    },
    validationSchema: AddQuestionSchema,
    onSubmit: (values, { resetForm }) => {
      if (editFlag && qid !== -1) {
        const tmp = questions;
        tmp[qid].question = addQuestionFormik.values.question;
        tmp[qid].image = fieldValue;
        tmp[qid].quizAnswers = answers;
        setQuestions(tmp);
        setQid(-1);
        setEditFlag(false);
      } else {
        setQuestions([
          ...questions,
          { question: addQuestionFormik.values.question, image: fieldValue, quizAnswers: answers }
        ]);
      }
      setQuestion('');
      setFieldValue('');
      setAnswers([]);
      setOpen(false);
      resetForm({
        values: {
          question: ''
        }
      });
    }
  });
  const editAnswer = (index) => {
    setInd(index);
    setAnswer(answers[index].answer);
    setCorrect(answers[index].isCorrect);
    setAnswerMode(true);
    setEditMode(true);
    setFlag(true);
  };
  if (!editFlag && edit !== null) {
    setEditFlag(true);
    console.log(edit);
    setQid(edit.qid);
    setOpen(true);
    setFieldValue(edit.image);
    addQuestionFormik.values.question = edit.question;
    setAnswers(edit.quizAnswers);
    setEdit(null);
  }
  if (flag) {
    addAnswerFormik.values.answer = ans;
    setFlag(false);
  }
  const { errors, touched, handleSubmit, getFieldProps } = addAnswerFormik;
  return (
    <Modal
      open={open}
      onBackdropClick={() => {
        if (!editFlag) setOpen(false);
      }}
      sx={{
        justifyContent: 'center',
        display: 'flex',
        margin: height > 750 ? '65px auto' : '0px auto',
        maxWidth: 480
      }}
    >
      <Box
        style={{
          width: '95%',
          backgroundColor: '#2d3436',
          padding: '20px 10px',
          borderRadius: '15px'
        }}
      >
        <FormikProvider value={addQuestionFormik}>
          <Form autoComplete="off" noValidate onSubmit={addQuestionFormik.handleSubmit}>
            <Box
              sx={{
                backgroundColor: '#74B9FF',
                minHeight: '30vh',
                borderRadius: '15px',
                position: 'relative',
                marginBottom: '15px',
                paddingTop: 'calc(100% * 3 / 4)'
              }}
            >
              {fieldValue === '' && (
                <Box
                  component="img"
                  src="/static/logo.svg"
                  width="60%"
                  height="auto"
                  color="#FDCB6E"
                  sx={{ position: 'absolute', bottom: '35%', right: '20%' }}
                />
              )}
              {fieldValue !== '' && <CoverImgStyle alt="Question Image" src={fieldValue} />}
              <IconButton
                variant="contained"
                component="label"
                sx={{ backgroundColor: '#636E72', position: 'absolute', top: '3%', right: '2%' }}
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
              label="Question"
              {...addQuestionFormik.getFieldProps('question')}
              error={Boolean(
                addQuestionFormik.touched.question && addQuestionFormik.errors.question
              )}
              helperText={addQuestionFormik.touched.question && addQuestionFormik.errors.question}
            />
            <div
              style={{
                width: '100%',
                backgroundColor: '#636E72',
                margin: '15px 0',
                fontSize: 0,
                height: '8px',
                borderRadius: '10px'
              }}
            >
              s
            </div>
            {!answerMode &&
              answers.length !== 0 &&
              answers.map((item, index) => (
                <Box
                  sx={{
                    backgroundColor: item.isCorrect ? '#55efc4' : '#636e72',
                    padding: '10px',
                    borderRadius: '10px',
                    position: 'relative',
                    marginBottom: '10px'
                  }}
                  key={index}
                  onClick={() => editAnswer(index)}
                >
                  <Typography variant="body1" noWrap="false" sx={{ marginLeft: '40px' }}>
                    {item.answer}
                  </Typography>
                  <Box
                    component={Avatar}
                    children={letters[index]}
                    width="30px"
                    height="30px"
                    sx={{
                      position: 'absolute',
                      top: '17%',
                      left: '1.5%',
                      backgroundColor: '#FDCB6E'
                    }}
                  />
                </Box>
              ))}

            {!answerMode && answers.length === 0 && (
              <Box
                style={{
                  width: '100%',
                  border: '3px solid #FDCB6E',
                  borderRadius: '15px',
                  padding: '10px'
                }}
              >
                <Typography
                  variant="h3"
                  textAlign="center"
                  style={{ marginBottom: '25px', marginTop: '25px' }}
                >
                  No answers for this question
                </Typography>
                <Button
                  variant="outlined"
                  style={{ width: '100%' }}
                  onClick={() => setAnswerMode(true)}
                >
                  Add new answer
                </Button>
              </Box>
            )}

            {!answerMode && answers.length === 1 && (
              <Box
                style={{
                  width: '100%',
                  border: '3px solid #FDCB6E',
                  borderRadius: '15px',
                  padding: '10px'
                }}
              >
                <Typography
                  variant="h3"
                  textAlign="center"
                  style={{ marginBottom: '25px', marginTop: '25px' }}
                >
                  Your question must have at least 2 answers
                </Typography>
                <Button
                  variant="outlined"
                  style={{ width: '100%' }}
                  onClick={() => setAnswerMode(true)}
                >
                  Add new answer
                </Button>
              </Box>
            )}
            {!answerMode && answers.length > 1 && answers.length < 4 && (
              <Button
                variant="outlined"
                style={{ width: '100%', padding: '10px' }}
                onClick={() => setAnswerMode(true)}
              >
                Add new answer
              </Button>
            )}
            {!answerMode && answers.length >= 2 && (
              <Button
                variant="contained"
                type="submit"
                style={{ width: '100%', marginTop: '5px' }}
                disabled={answers.filter((item) => item.isCorrect).length === 0}
              >
                {editFlag ? 'Edit Question' : 'Save Question'}
              </Button>
            )}
          </Form>
        </FormikProvider>
        {answerMode && (
          <FormikProvider value={addAnswerFormik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Answer"
                {...getFieldProps('answer')}
                error={Boolean(touched.answer && errors.answer)}
                helperText={touched.answer && errors.answer}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                style={{ marginTop: '10px' }}
              >
                <Typography variant="h3">Is Correct?</Typography>
                <Switch
                  size="medium"
                  checked={correct}
                  disabled={
                    editMode
                      ? answers.filter((item) => item.isCorrect).length === 1 &&
                        !answers[ind].isCorrect
                      : answers.filter((item) => item.isCorrect).length === 1
                  }
                  onChange={(value) => setCorrect(value.target.checked)}
                />
              </Stack>
              <Button
                variant="contained"
                style={{ width: '100%', marginTop: '20px' }}
                type="submit"
              >
                {editMode ? 'Edit answer' : 'Save answer'}
              </Button>
            </Form>
          </FormikProvider>
        )}
      </Box>
    </Modal>
  );
}
