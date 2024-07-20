const config = useRuntimeConfig();



export default defineEventHandler(async (event) => {
    let body ;
    try{
        body = await readBody(event);
    }catch(e){
        console.log(e);
    }
    // body: { query : queryMsg}

    const url = config.mongodbAtlasGraphqlUrl;
	const queryMsg = body.query;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apiKey': config.mongodbKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryMsg
        })
	})

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }


    return await response.json();
});