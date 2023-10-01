
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    //console.log(body) // { "imageUrl": <url for image> }

    const url = config.metalSearcheUrl+"?limit=5";
    const response = await fetch(url, {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json',
            'x-metal-api-key': config.metalApiKey,
            'x-metal-client-id': config.metalClientId,
        },
        body: JSON.stringify({
            index: config.metalImageIndex,
            imageUrl: body.imageUrl,
        }),
    });
    
    const data = await response.json();
    //console.log(data);
    return JSON.stringify(data);
});