const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);
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