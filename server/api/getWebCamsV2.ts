import type { webCamObj } from '../../type/webCam';

const config = useRuntimeConfig();

export default defineEventHandler(async event => {
  let body;
  try {
    body = await readBody(event);
  } catch (e) {
    console.log(e);
  }

  const url = config.hasuraGraphqlUrl;
  const queryMsg = body.query;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-hasura-admin-secret': config.hasuraGraphqlAdminSecret,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryMsg,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }

  const respJson = await response.json();
  // console.log(respJson);
  // respJsonからwebcamを取得してJson配列の形式で返す。
  let webcamArray;
  if (respJson.data && respJson.data.webcam) {
    webcamArray = respJson.data.webcam.map((webcam: any) => {
      // ここで出力
      console.log(webcam); // オブジェクトの中身を確認
      console.log(webcam.webcam.webcamid); // オブジェクトの中身を確認

      return {
        webcamid: webcam.webcam.webcamid,
        status: webcam.webcam.status,
        title: webcam.webcam.title,
        location: {
          country: webcam.webcam.location.country,
          latitude: webcam.webcam.location.latitude,
          longitude: webcam.webcam.location.longitude,
        },
        player: {
          day: webcam.webcam.player.day,
        },
        images: {
          current: {
            thumbnail: webcam.webcam.images.current.thumbnail,
          },
        },
      } as webCamObj;
    });
  }

  return { webcams: webcamArray };
});
