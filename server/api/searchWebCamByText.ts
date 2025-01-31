//import type { metalWebCamObj } from "../../type/searchedData";
import type { webCamMetadata } from "../../type/webCam";
import {translateText} from "../../composables/translateText";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {

    const body = await readBody(event);

    try{
        const queryString = await translateText(body.query,config);
        const imageCount = body.count || 10;

        console.log(config.metalSearcheUrl);
        const result = await fetch( config.metalSearcheUrl+"/api/searchWebcam", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "count": imageCount,
                "query": queryString
            })
        });

        const data = await result.json();
        //console.log(data);

        const filteredDatas = data.filter((item : webCamMetadata) => item.score > 0.23);
            
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