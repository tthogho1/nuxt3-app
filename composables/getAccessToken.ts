import { ref } from "vue";
import { accessTokenObj } from "~/pages/def/webCam";

export const getAuthenticate = async function () : Promise<accessTokenObj>
{
    const response = await fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/auth/providers/api-key/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "key": "zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm"
        })
	})

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    const now = Math.floor(new Date().getTime()/1000);

    return { accessToken :data.access_token, getTime : now};

};
