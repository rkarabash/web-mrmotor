import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/App';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import News from './pages/News';
import NotFound from './pages/Page404';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cars from './pages/Cars';
import Racers from './pages/Racers';
import Competitions from './pages/Competitions';
import Quizzes from './pages/Quizzes';
import User from './pages/User';
import Settings from './pages/Settings';
import Post from './pages/Post';
import Quiz from './pages/Quiz';
import QuizRun from './pages/QuizRun';
import QuizEdit from './pages/QuizEdit';
import Favorites from './pages/Favorites';
import Results from './pages/Results';
import Search from './pages/Search';
// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/app',
      element: <DashboardLayout />,
      children: [
        { path: 'home', element: <Home /> },
        { path: 'news', element: <News /> },
        { path: 'cars', element: <Cars /> },
        { path: 'racers', element: <Racers /> },
        { path: 'competitions', element: <Competitions /> },
        { path: 'quizzes', element: <Quizzes isMy={false} /> },
        { path: 'profile', element: <User /> },
        { path: 'settings', element: <Settings /> },
        { path: 'post', element: <Post /> },
        { path: 'quiz', element: <Quiz /> },
        { path: 'quizrun', element: <QuizRun /> },
        { path: 'myquizzes', element: <Quizzes isMy="true" /> },
        { path: 'quiz/new', element: <QuizEdit /> },
        { path: 'favorites', element: <Favorites /> },
        { path: 'results', element: <Results /> },
        { path: 'search', element: <Search /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/app/home" /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
