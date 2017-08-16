import Base from './components/Base.jsx';
import HomePage from './components/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/',
      comment: HomePage
    },
    {
      path: '/login',
      comment: LoginPage
    },
    {
      path: '/signup',
      comment: SignUpPage
    },

  ]
};

export default routes;