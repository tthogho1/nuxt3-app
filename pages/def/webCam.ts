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

export {webCamObj}