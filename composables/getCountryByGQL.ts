import type {countryData} from "../type/country";

export const getCountryByGQL = async function (token:string) : Promise<Array<countryData>>
{

    const response = await fetch('api/getCountries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
	})

    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }

    const data = await response.json();
    console.log(data);

    const countries = data.data.countries;

    return countries;   
};
