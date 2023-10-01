// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    css: ["bootstrap/dist/css/bootstrap.min.css",
        "bootstrap-icons/font/bootstrap-icons.css"],
    ssr: true,
    app: {
        baseURL: '/'
    },
    modules: ['@pinia/nuxt'],
    runtimeConfig: {
        metalClientId:'',
        metalSearcheUrl:'',
        metalImageIndex:'',
        metalApiKey:'',
        resemblePicLambda:'',
        mongodbAtlasToken:'',
        mongodbAtlasGraphqlUrl:'',
        mongodbKey:'',
        supabaseUrl:'',
        supabaseKey:'',

        public: {
            googleMapsApiKey:'',
    
            MONGODB_ATLAS_TOKEN_INTERVAL : 1200000,
        }
    }
})
