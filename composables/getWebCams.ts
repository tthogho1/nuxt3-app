import { ref } from "vue";
import type { webCamObj} from "../type/webCam"

export const getWebCams = async function (token:string,queryMsg:string) : Promise<Array<webCamObj>>
{
    const response = await fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/graphql', {
        method: 'POST',
        headers: {
			'Authorization': token  ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryMsg
        })
	})

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);
    
    return Array.from(data.data.webcams);    
};



export const getWebCamsByApi = async function (queryMsg:string) : Promise<Array<webCamObj>>
{
    
    const response = await fetch('api/getWebCams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryMsg
        })
    });

    const data = await response.json();
    console.log(data);

    return Array.from(data.data.webcams);

};

