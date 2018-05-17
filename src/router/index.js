import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home';
import SearchQuotes from '../components/SearchQuotes';
import SmartQuote from '../components/SmartQuote';
import Developer from '../components/Developer';
import Register from '../components/Register';
import Login from '../components/Login';
import store from '../store';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/search',
      name: 'SearchQuotes',
      component: SearchQuotes,
      beforeEnter: (to, from, next) => {
        if (store.state.currentUser) {
          next();
        } else {
          next('/');
        }
      }
    },
    {
      path: '/smartquote',
      name: 'SmartQuote',
      component: SmartQuote,
      beforeEnter: (to, from, next) => { 
        if (store.state.currentUser){
          next();
        } else {
          next('/');
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/developer',
      name: 'Developer',
      component: Developer,
    },
  ],
});
