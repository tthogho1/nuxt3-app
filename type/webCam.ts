type  webCamObj = {
    webcamid:number;
    status: string;
    title:  string;
    location : {
        country: string;
        latitude: number;
        longitude: number;
    }
    player : {
        day:string
    } 
    images : {
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
    webcamid
    title
    location{
        country
        latitude
        longitude
    }
    player{
        day
    }
    images{
        current{
            thumbnail
        }    
    }
}`

type accessTokenObj = {
    accessToken: string;
    getTime : number;
}

// from metal image index
type  metalImageObj = {
    id:string;
    dist:  string;
    imageUrl:string;
    metadata : {
        country: string; 
        imgUrl:string;
        latitude: number;
        longitude: number;
        title:string;
    };
};


export {webCamObj , Bound , webCamQuery, accessTokenObj, metalImageObj}