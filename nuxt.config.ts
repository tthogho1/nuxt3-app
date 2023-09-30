// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    css: ["bootstrap/dist/css/bootstrap.min.css",
        "bootstrap-icons/font/bootstrap-icons.css"],
    ssr: true,
    app: {
        baseURL: '/nuxt3-app/'
    },
    modules: ['@pinia/nuxt'],
    runtimeConfig: {
        public: {
            // This is the public key of the server
            // You can find it in the Realm Dashboard
            METAL_CLIENT_ID: 'ci_Klqqk9LpWdWUqA7EO2zlSYrTWLNHyRVGWXUD23Wf0pQ=',
            METAL_SEARCHE_URL: 'https://api.getmetal.io/v1/search',
            METAL_IMAGE_INDEX: '650fbf41ded6e7b8b47766d8',
            METAL_API_KEY: 'pk_jEyG+TzAS1czHqStsWJRdEghxfz+rvfpNdBzZ+mY/OU=',
            
            GOOGLE_MAPS_API_KEY: 'AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0',
            RESEMBLE_PIC_LAMBDA :'https://77vd6pifbj5z2c2lvjbkuftzaa0lpozm.lambda-url.ap-northeast-1.on.aws/',
            SUPABASE_URL : 'https://mzojgijectnqzezyfndy.supabase.co',
            SUPABASE_PUBLIC_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b2pnaWplY3RucXplenlmbmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ0MDA1MDQsImV4cCI6MjAwOTk3NjUwNH0.ZoQGWQByUgglnfGCFCF1lmi0DKjs4JGPPhFx_nPrxeA',

            MONGODB_ATLAS_TOKEN_INTERVAL : 1200000,
            MONGODB_ATLAS_GRAPHQL_URL: 'https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/graphql',
            MONGODB_PUBLIC_KEY: 'zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm'
        }
    }
})
