import type {countryData} from "../../type/country";

interface GraphQLResponse {
    data: {
        countries: Array<{
            code: string;
            country: string;
        }>;
    };
}

const config = useRuntimeConfig();
const token = config.public.mongodbKey;
const graphurl = config.mongodbAtlasGraphqlCountryUrl as string;

export default defineEventHandler(async (event) => {
    let body ;
    try{
        body = await readBody(event);
    }catch(e){
        console.error('Error in reading body:', e);
    }

  //  const url = config.mongodbAtlasGraphqlUrl;
    const queryMsg = `query GetCountries {        
        countries(sortBy:COUNTRY_ASC) {
            code
            country
            }
        }`;
 
    try {
        const response = await fetch(graphurl, {
            method: 'POST',
            headers: {
                'apiKey': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: queryMsg })
        });

        if (!response.ok) {
            console.error('Network response was not ok, status:', response.status);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: GraphQLResponse = await response.json();

        const modifiedData = {
            ...data,
            data: {
                countries: data.data.countries.map((country): countryData => ({
                    country_code: country.code,
                    country: country.country
                }))
            }
        };

        return modifiedData;

    } catch (error) {
        console.error('Error fetching countries:', error);
        throw new Error('There was an error processing your request.');
    }
});
