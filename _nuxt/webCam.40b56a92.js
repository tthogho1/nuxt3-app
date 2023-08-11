const t=`{
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
}`;export{t as webCamQuery};
