<template>
<div>
  <h1>{{header}}</h1>
  <ul>
    <li v-for="(link, i) in links" :key="`link${i}`">
      <a :href="link.url">{{link.text}}</a>
    </li>
    <li v-if="!currentUser" v-for="(link, i) in publicLinks" :key="`public${i}`">
      <a :href="link.url">{{link.text}}</a>
    </li>
    <li v-if="currentUser" v-for="(link, i) in authLinks" :key="`auth${i}`">
      <a :href="link.url">{{link.text}}</a>
    </li>
    <li v-if="currentUser">
      <a href="#/" @click="logout">Logout</a>
    </li>
  </ul>
</div>
</template>

<script>
import App from '../../App';
import Vuex from 'vuex'


export default {
  name: 'Navbar',
  data() {
    return {
      header: 'GoodQuotes',
      links: [{
          url: '#/',
          text: 'Home',
        },
        {
          url: '#/developer',
          text: 'Developer',
        }],
      authLinks: [
        {
          url: '#/myquotes',
          text: 'MyQuotes',
        },
        {
          url: '#/search',
          text: 'SearchQuotes',
        },
        {
          url: '#/smartquote',
          text: 'SmartQuote',
        }],
      publicLinks: [
        {
          url: '#/login',
          text: 'Login',
        },
        {
          url: '#/register',
          text: 'Register',
        }],
    };
  },
  methods: {
    ...Vuex.mapActions(["logout"])
  },
  computed: {
    ...Vuex.mapGetters(["isLoggedIn", "currentUser"])
  }
};

</script>

<style scoped>
div {
  background: rgb(0, 13, 51);
  color: whitesmoke;
}

h1 {
  text-align: center;
  font-size: 2.6em;
  letter-spacing: .1em;
  margin: 0;
  padding: 1em .6em .6em;
}

a {
  text-decoration: none;
  font-size: 1.15em;
  color: inherit;
  transition: all .18s;
}

ul {
  display: flex;
  margin: 1em auto;
  justify-content: space-evenly;
  align-items: center;
  padding-bottom: 1em;
}

li {
  display: inline-block;
  width: 18%;
  text-align: center
}

a:hover {
  color: bisque;
  letter-spacing: .1em;
  text-shadow: 0 0 .1em whitesmoke;
}


</style>
