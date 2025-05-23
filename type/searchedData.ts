type  metalWebCamObj = {
    id:string;
    dist:  string;
    text:string;
    metadata : {
        country: string; 
        imgUrl:string;
        latitude: number;
        longitude: number;
        title:string;
    };
};

export type { metalWebCamObj }