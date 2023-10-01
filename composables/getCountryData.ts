import {countryData} from "../type/country";
import { createClient } from '@supabase/supabase-js';

export const getCountryData = async function () : Promise<Array<countryData>>
{
    const config = useRuntimeConfig();

    const client = createClient(config.supabaseUrl, config.supabaseKey);

    const {data:location,error} = await client.from('location').select('country_code,country');
//    console.log(location);
    if (error){ 
        console.log(error);
        throw new Error(error.message) ;
    }

    const countries : Array<countryData> = location;

    return countries;   
};
