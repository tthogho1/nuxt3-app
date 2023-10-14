import {countryData} from "../type/country";
import { createClient } from '@supabase/supabase-js';

export const getCountryData = async function (supabaseUrl:string,supabaseKey:string) : Promise<Array<countryData>>
{
    const client = createClient(supabaseUrl, supabaseKey);

    const {data:location,error} = await client.from('location')
                                            .select('country_code,country')
                                            .order('country', { ascending: true });
//    console.log(location);
    if (error){ 
        console.log(error);
        throw new Error(error.message) ;
    }

    const countries : Array<countryData> = location;

    return countries;   
};
