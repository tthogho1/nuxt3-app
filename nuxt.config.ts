// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    css: ["bootstrap/dist/css/bootstrap.min.css",
        "bootstrap-icons/font/bootstrap-icons.css"],
    ssr: false,
    app: {
        baseURL: '/nuxt3-app/'
    },
    modules: ['@pinia/nuxt'],
    runtimeConfig: {
        public: {
            // This is the public key of the server
            // You can find it in the Realm Dashboard
            GOOGLE_MAPS_API_KEY: 'AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0',
            RESEMBLE_PIC_LAMBDA :'https://77vd6pifbj5z2c2lvjbkuftzaa0lpozm.lambda-url.ap-northeast-1.on.aws/',
            // REALM_PUBLIC_KEY: process.env.REALM_PUBLIC_KEY
            // REALM_PUBLIC_KEY: 'zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm'
        }
    }
})
