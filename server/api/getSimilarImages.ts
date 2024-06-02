
const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    //console.log(body) // { "imageUrl": <url for image> }

    const url = config.metalSearcheUrl + "/api/searchWebcamByURL" ;
    const response = await fetch(url, {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            count:body.count,
            imageUrl: config.public.imageServer + body.imageUrl + ".jpg" ,
        }),
    });
    
    const data = await response.json();
    //console.log(data);
    return JSON.stringify(data);
});