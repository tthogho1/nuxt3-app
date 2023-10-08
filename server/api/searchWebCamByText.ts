//import type { metalWebCamObj } from "../../type/searchedData";
import type { metalImageObj } from "../../type/webCam";
import {translateText} from "../../composables/translateText";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try{
        const queryString = await translateText(body.text,config);

        const result =await fetch( config.metalSearcheUrl+"?limit=100", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-metal-api-key": config.metalApiKey,
                "x-metal-client-id": config.metalClientId
            },
            body: JSON.stringify({
                "index": config.metalImageIndex,
                "text": queryString
            })
        });

        //console.log(result);
        const data = await result.json();
    
        const filteredDatas = data.data.filter((item : metalImageObj) => parseFloat(item.dist) < 0.79);
            
        return {
            status: result.status,
            body: JSON.stringify(filteredDatas),
        };  
    }catch(error){
        console.log("error " + error);
        
        return {
            statusCode: 500,
            body: error,
        };
    }    
});