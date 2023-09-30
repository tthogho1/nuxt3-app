const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
    // body: { query : queryMsg}

    const url = config.public.MONGODB_ATLAS_GRAPHQL_URL;
	const queryMsg = body.query;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'apiKey': config.public.MONGODB_PUBLIC_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryMsg
        })
	})

    //console.log(response);
    // console.log(response.status);
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    return await response.json();
});