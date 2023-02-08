require('dotenv').config();
const axios = require('axios');
const argv = process.argv;

const claps = 50;
const endpoint = "https://medium.com/_/graphql";
const cookie = process.env.MEDIUM_COOKIE;
const userId = process.env.USER_ID;

let postId = argv[argv.length-1];

if (postId.indexOf("http") > -1 || postId.indexOf("archway.io") > -1) {
  let pieces = postId.split("-");
  postId = pieces[pieces.length-1];
}

function clap() {
  const config = {
    headers:{
      'Content-Type': 'application/json',
      'Cookie': cookie,
    }
  };

  const postBody = [{
    "operationName":"ClapMutation",
    "variables":{
      "targetPostId": postId,
      "userId": userId,
      "numClaps": claps
    },
    "query": "mutation ClapMutation($targetPostId: ID!, $userId: ID!, $numClaps: Int!) {\n  clap(targetPostId: $targetPostId, userId: $userId, numClaps: $numClaps) {\n    viewerEdge {\n      ...ClapMutation_viewerEdge\n      __typename\n    }\n    ...ClapMutation_post\n    __typename\n  }\n}\n\nfragment ClapMutation_post on Post {\n  __typename\n  id\n  clapCount\n  ...MultiVoteCount_post\n}\n\nfragment MultiVoteCount_post on Post {\n  id\n  ...PostVotersNetwork_post\n  __typename\n}\n\nfragment PostVotersNetwork_post on Post {\n  id\n  voterCount\n  recommenders {\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment ClapMutation_viewerEdge on PostViewerEdge {\n  __typename\n  id\n  clapCount\n}\n"
  }];
  
  axios.post(endpoint, postBody, config)
    .then((res) => {
      if (res.data[0]['errors'])
        console.log("Failed to clap 50x 😞\n", JSON.stringify(res.data));
      else
        console.log("WOOP! You just clapped 50x 😎\n", JSON.stringify(res.data));
    })
    .catch((err) => {
      console.log("Failed to clap 50x 😞", JSON.stringify(err));
    });
}

clap();