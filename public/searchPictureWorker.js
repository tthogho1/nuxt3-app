//importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js");
//const model = await tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_96/feature_vector/2/default/1",{ fromTFHub: true });
//const img = document.getElementById('myImage');
//const tensor = tf.browser.fromPixels(img).resizeBilinear([96, 96]).expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1));

function getWebCamInfo(idArrayString,token,self) {

  const queryMsg = `query {
    webcams(
      query:{
        id_in:${idArrayString}
      },
      limit: 100	
      ) {
        id
        title
        location{
          country
          latitude
          longitude
        }
        player{
          day{
            available
            link
          }
        }
        image{
          current{
            thumbnail
          }    
        }
      }
    }`;
  
    fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token  ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: queryMsg
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('post request to mongodb atlas failed');
      }
    }).then(jsonData => {
        // レスポンスデータの処理
        console.log(jsonData);
  
        self.postMessage(jsonData);
    })
    .catch(error => {
      console.log(error.message);
    });
}

const url = "https://77vd6pifbj5z2c2lvjbkuftzaa0lpozm.lambda-url.ap-northeast-1.on.aws/";
self.addEventListener('message',(e) => {

  const data = {
    base64String: e.data.base64String,
  };
  
  const {token} = e.data.token;

  // Fetch APIを使用してPOSTリクエストを送信する
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('post request to pinecorn failed');
    }
  }).then(jsonData => {
      // レスポンスデータの処理
      console.log(jsonData.matches);

      const idArray = jsonData.matches.map(obj => Object.values(obj)[0].replace(".jpg",""));
      const idArrayString = `[${idArray.map(item => `"${item}"`).join(", ")}]`;
      getWebCamInfo(idArrayString,token,self);
  })
  .catch(error => {
    console.log(error.message);
  });
  
}, false);
  