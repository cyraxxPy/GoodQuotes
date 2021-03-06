<template>
<div>
  <div id="searchContainer">
    <div id="searchSelect">
      <span v-for="(btn,i) in searchBtn" :key="`radio${i}`">
        <input type="radio" :value="btn" v-model="checked" @click="toggleSearch()"/>
        <label for="btn">{{btn}}</label>
      </span>
    </div>
    <input id="searchbar" type="text" :placeholder="searchMsg" v-model="searchContent" @keyup.enter="searchQuote()"/>
    <p v-if="!radioSelected">Please select a search category</p>
  </div>
  <div v-if="searchReturn">
    <Quote v-for="(qu, i) in quotes" :key="i" :quote="qu.quote" :author="qu.author" :title="qu.publication" >
      <button @click="quoteAction">
        <img :src="quoteCheck(qu.quote)"/>
      </button>
    </Quote>
  </div>
  <div id="errMsg" v-if="errMsg">Could not retreive any {{checked}} results for "{{searchContent}}"</div>
</div>
</template>

<script>
import axios from 'axios';
import Quote from './partials/Quote';

export default {
  name: 'SearchQuotes',
  beforeMount() {
    axios.post(`${this.$store.state.devEnv}/quote-check`, {
      uid: +this.$store.state.currentUser,
    }).then(matchedQuotes => {
      let userQs = matchedQuotes.data.map(q=>q[`Quote.content`]);
      this.$store.commit('saveQuotes', userQs)
    });
  },
  data() {
    return {
      searchContent: '',
      searchMsg: 'Search for a quote',
      searchBtn: ['tag','author','title'],
      checked: '',
      radioSelected: true,
      searchReturn: false,
      errMsg: false,
      quotes: [],
      quoteData: ''
    }
  },
  components: {Quote},
  methods: {
    quoteCheck(q){
      return this.$store.state.userQuotes.includes(q) ? require('../assets/goldstar.png') : require('../assets/star.png');
    },
    toggleSearch() {
      this.radioSelected = true;
    },
    searchQuote() {
      if (this.checked) {
        let searchField = this.searchContent.toLowerCase().replace(/\s/g, '+');
        axios.get(`${this.$store.state.devEnv}/${this.checked}/${searchField}`)
        .then((res) => {
          this.errMsg = false;
          this.quotes = res.data.quotes;
          this.quoteData = res.data;
          this.searchReturn = true;
          if (this.checked === 'tag'){
            axios.post(`${this.$store.state.devEnv}/user-tag`, {
              uid: +this.$store.state.currentUser,
              tag: this.searchContent
            });
          }
        })
        .catch(e => {
          this.searchReturn = false;
          this.errMsg = true;
        });
       } else { 
         this.radioSelected = false;
       }
    },
    quoteAction: function (e){
      if(e.path[0].src.includes('dist/star.png')){
        axios.post(`${this.$store.state.devEnv}/user-quote`, {
          content: e.path[3].children[0].innerText,
          author: e.path[3].children[1].children[0].innerText,
          uid: +this.$store.state.currentUser
        }).then(newQ=>{
          // console.log(newQ);
          this.$store.commit('pushQuote', e.path[3].children[0].innerText)
          e.path[0].src = 'dist/goldstar.png'
        });
      } else if (e.path[0].src.includes('goldstar')) {
        axios.post(`${this.$store.state.devEnv}/user-quote?_method=DELETE`, {
          content: e.path[3].children[0].innerText,
          uid: +this.$store.state.currentUser
        }).then(rmQ=> {
          this.$store.commit('rmQuote', e.path[3].children[0].innerText);
          e.path[0].src = 'dist/star.png';
        })
      }
    }
  },
  watch: {
    searchContent() {
      if (!this.searchContent) {
          this.searchReturn = false;
          this.errMsg = false;
        };
    },
    checked(){
      this.errMsg = false;
    }
  }
};

</script>

<style scoped>

#searchContainer {
  display: block;
  margin: 2em auto;
  max-width: 400px;
}

#searchbar {
  display: inline-block;
  width: 100%;
  margin: 1em auto;
  font-size: 1em;
  padding: .1em;
  text-align: center;
  outline: none;
  transition: all .1s; 
}

#searchbar:focus{
  box-shadow: 0 0 1em dodgerblue;
}

#searchSelect{
  display: flex;
  justify-content: space-between;
  max-width: 70%;
  margin: auto
}

#searchContainer>p{
  color: red;
  text-align: center
}

#errMsg {
  text-align: center;
}

button {
  width: 40px;
  height: auto;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

button>img{
  width: 50%;
  height: auto;
}

</style>
