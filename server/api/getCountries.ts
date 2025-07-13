import type { countryData } from '../../type/country';
// add for unit test
import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';

interface GraphQLResponse {
  data: {
    CountryView: Array<{
      countrycode: string;
      country: string;
    }>;
  };
}

export const handler = defineEventHandler(async event => {
  const config = useRuntimeConfig();
  let token = config.hasuraGraphqlAdminSecret as string;
  let graphurl = config.hasuraGraphqlUrl as string;

  let body;
  try {
    body = await readBody(event);
  } catch (e) {
    console.error('Error in reading body:', e);
  }

  const queryMsg = `query GetCountries {        
        CountryView(order_by: {country: asc}) {
            countrycode
            country
            }
        }`;

  try {
    const response = await fetch(graphurl, {
      method: 'POST',
      headers: {
        'x-hasura-admin-secret': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: queryMsg }),
    });

    if (!response.ok) {
      console.error('Network response was not ok, status:', response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: GraphQLResponse = await response.json();

    const modifiedData = {
      ...data,
      data: {
        countries: data.data.CountryView.map(
          (country): countryData => ({
            country_code: country.countrycode,
            country: country.country,
          })
        ),
      },
    };

    return modifiedData;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw new Error('There was an error processing your request.');
  }
});

export default handler;
