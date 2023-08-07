type  webCamObj = {
    id:string;
    status: string;
    title:  string;
    location : {
        country: string;
        latitude: number;
        longitude: number;
    }
    player : {
        day:{
            available:string;
            link:string;
        }
    } 
    image : {
            current : {
            thumbnail:string;
        }
    };
};

type Bound ={
    latitude_gte: number,
    latitude_lt: number,
    longitude_gte:number,
    longitude_lt:number,
};


const webCamQuery = `{
    id
    title
    location{
        country
        latitude
        longitude
    }
    player{
        day{
            available
            link
        }
    }
    image{
        current{
            thumbnail
        }    
    }
}`

type accessTokenObj = {
    accessToken: string;
    getTime : number;
}

export {webCamObj , Bound , webCamQuery, accessTokenObj}