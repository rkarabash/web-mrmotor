// component
import Iconify from '../../components/Iconify';
// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Home',
    path: '/app/home',
    icon: getIcon('bxs:home')
  },
  {
    title: 'Quizzes',
    path: '/app/quizzes',
    icon: getIcon('ri:survey-fill')
  },
  {
    title: 'News',
    path: '/app/news',
    icon: getIcon('fluent:news-24-filled')
  },
  {
    title: 'Cars',
    path: '/app/cars',
    icon: getIcon('bxs:car')
  },
  {
    title: 'Racers',
    path: '/app/racers',
    icon: getIcon('mdi:steering')
  },
  {
    title: 'Competitions',
    path: '/app/competitions',
    icon: getIcon('fa-solid:trophy')
  }
];

export default sidebarConfig;
