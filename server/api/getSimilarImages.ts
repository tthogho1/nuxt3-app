
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    //console.log(body) // { "imageUrl": <url for image> }

    const url = config.public.METAL_SEARCHE_URL+"?limit=5";
    const response = await fetch(url, {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json',
            'x-metal-api-key': config.public.METAL_API_KEY,
            'x-metal-client-id': config.public.METAL_CLIENT_ID,
        },
        body: JSON.stringify({
            index: config.public.METAL_IMAGE_INDEX,
            imageUrl: body.imageUrl,
        }),
    });
    
    const data = await response.json();
    //console.log(data);
    return JSON.stringify(data);
});