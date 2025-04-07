import type {countryData} from "../../type/country";

const config = useRuntimeConfig();
const token = config.public.mongodbKey;
const graphurl = config.mongodbAtlasGraphqlCountryUrl as string;

export default defineEventHandler(async (event) => {
    let body ;
    try{
        body = await readBody(event);
    }catch(e){
        console.log(e);
    }

  //  const url = config.mongodbAtlasGraphqlUrl;
    const queryMsg = `query GetCountries {        
        countries(sortBy:COUNTRY_ASC) {
            code
            country
            }
        }`;
 
    const response = await fetch(graphurl, {
        method: 'POST',
        headers: {
            'apiKey': token  ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: queryMsg
        })
    })

    if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    const modifiedData = {
        ...data,
        data: {
            countries: data.data.countries.map((country: any):countryData => {
                return {
                    country_code: country.code,
                    country: country.country
                };
            })
        }
    };

    return modifiedData;

});