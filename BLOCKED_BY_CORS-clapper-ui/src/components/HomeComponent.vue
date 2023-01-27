<template>
  <div class="content">
    <h3>Medium Clapper</h3>

    <div class="controls">
      <div class="user-id">
        <input 
          v-model="userId" 
          class="form-control" 
          type="text" 
          placeholder="Medium User ID" 
        >
      </div>

      <div class="medium-url">
        <input 
          v-model="clapTarget.url" 
          class="form-control" 
          type="text" 
          placeholder="Medium URL" 
        >
      </div>

      <div class="user-cookie">
        <textarea 
          v-model="cookie" 
          class="form-control" 
          type="text" 
          placeholder="Medium Auth Cookie"
        />
      </div>

      <div class="do-clap">
        <button class="btn btn-clap" @click="clap()" :disabled="!clapTarget.url || !userId || !cookie">Clap 50 Times</button>

        <div class="response">
          <div class="success" v-if="apiResponse.success">
            <p>WOOP! You just clapped 50x 😎</p>
              <p>{{apiResponse.success}}</p>
          </div>
          <div class="err" v-if="apiResponse.error">
            <p>Failed to clap 50x 😞</p>
            <p>{{apiResponse.error}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeComponent',
  data: () => ({
    cookie: "_ga=GA1.2.1770823718.1573282440; optimizelyEndUserId=lo_9f6f9ba4cce5; nonce=ZUlC6e4c; uid=ab081a530bc5; sid=1:jyv3sPqz2SPItmk5Plg5Sz5aHrOHFjC/fuKHZRRk/yGf+Q9YF5iE0l2lwsT2EDFy; __cfruid=d18232d3ddeea4e86ab5e21489304c8bc9841e2b-1674656888; _gid=GA1.2.1379610889.1674656893; xsrf=14d995e8073b; _dd_s=rum=0&expire=1674770249701; _gat=1",
    userId: null,
    claps: 50,
    clapTarget: {
      url: null,
      id: null,
    },
    graphql: {
      clap: "https://medium.com/_/graphql"
    },
    apiResponse: {
      success: null,
      error: null
    },
  }),
  mounted: async function () {
    console.log('Home mounted');
  },
  methods: {
    clap: async function () {
      this.apiResponse.success = null;
      this.apiResponse.error = null;

      if (!this.clapTarget.url) return;
      let pieces = this.clapTarget.url.split('-');
      this.clapTarget.id = pieces[pieces.length-1];

      const config = {
        headers:{
          'Content-Type': 'application/json',
          'Cookie': this.cookie,
        }
      };

      const postBody = [{
        "operationName":"ClapMutation",
        "variables":{
          "targetPostId": this.clapTarget.id,
          "userId": this.userId,
          "numClaps": this.claps
        },
        "query": "mutation ClapMutation($targetPostId: ID!, $userId: ID!, $numClaps: Int!) {\n  clap(targetPostId: $targetPostId, userId: $userId, numClaps: $numClaps) {\n    viewerEdge {\n      ...ClapMutation_viewerEdge\n      __typename\n    }\n    ...ClapMutation_post\n    __typename\n  }\n}\n\nfragment ClapMutation_post on Post {\n  __typename\n  id\n  clapCount\n  ...MultiVoteCount_post\n}\n\nfragment MultiVoteCount_post on Post {\n  id\n  ...PostVotersNetwork_post\n  __typename\n}\n\nfragment PostVotersNetwork_post on Post {\n  id\n  voterCount\n  recommenders {\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment ClapMutation_viewerEdge on PostViewerEdge {\n  __typename\n  id\n  clapCount\n}\n"
      }];
      
      let that = this;
      axios.post(this.graphql.clap, postBody, config)
        .then((res) => {
          console.log(res)
          that.apiResponse.success = res;
        })
        .catch((err) => {
          console.log(err)
          that.apiResponse.error = err;
        });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
