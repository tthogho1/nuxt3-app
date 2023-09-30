import {countryData} from "../pages/def/country";
import { createClient } from '@supabase/supabase-js';

const config = useRuntimeConfig();
const supabaseUrl = config.public.SUPABASE_URL;
const supabaseKey = config.public.SUPABASE_PUBLIC_KEY;

const client = createClient(supabaseUrl, supabaseKey);
export const getCountryData = async function () : Promise<Array<countryData>>
{
    const {data:location,error} = await client.from('location').select('country_code,country');
    console.log(location);
    if (error){ 
        console.log(error);
        throw new Error(error.message) ;
    }

    const countries : Array<countryData> = location;

    return countries;   
};
