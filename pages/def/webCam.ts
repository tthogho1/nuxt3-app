type  webCamObj = {
    id:string;
    status: string;
    title:  string;
    location : {
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

export {webCamObj , Bound }