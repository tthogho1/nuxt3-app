# WebCamera Map Project

An interactive web application that allows users to explore webcams around the world through an interactive map interface. The application provides various search capabilities, including text-based search and country-based filtering.

## Features

### Interactive Map
- Google Maps integration showing webcam locations worldwide
- Marker clustering for better visualization of dense areas
- Click on markers to view webcam previews and access live feeds
- Navigate to your current location or search for specific locations

### Search Capabilities
- **Country-based Search**: Filter webcams by selecting a specific country
- **Text-based Search**: Find webcams using keyword search
- Adjustable image count for search results
- Pagination for browsing through large result sets

### Recommendations
- View recommended webcams similar to the ones you're viewing
- Recommendations based on image similarity analysis
- Quick navigation to recommended locations

## Technology Stack

### Frontend
- **Nuxt 3**: Vue.js framework for building the application
- **Vue 3**: Progressive JavaScript framework with TypeScript support
- **Bootstrap**: For responsive UI components and styling
- **Vue3 Google Map**: Component library for Google Maps integration

### Backend
- **Nuxt Server API Routes**: For handling API requests
- **MongoDB**: Database for storing webcam information
- **Realm Web SDK**: For MongoDB integration
- **TensorFlow.js**: Possibly used for image similarity analysis

### APIs & Services
- **Google Maps API**: For map rendering and geocoding
- **Supabase**: For additional backend functionality
- **Custom Image Similarity API**: For generating webcam recommendations

## Project Structure

```
├── components/             # Vue components
│   ├── Footer.vue          # Footer component
│   ├── Header.vue          # Header component
│   ├── search-button.vue   # Search button component
│   └── WebcamGallery.vue   # Gallery for displaying webcams
├── pages/                  # Application pages
│   ├── index.vue           # Main map page
│   └── search.vue          # Search interface
├── public/                 # Static assets
│   └── images/             # Images used in the application
├── server/                 # Server-side code
│   └── api/                # API endpoints
│       ├── getCountries.ts         # Get list of countries
│       ├── getSimilarImages.ts     # Get similar webcam images
│       ├── getWebCams.ts           # Get webcam data
│       └── searchWebCamByText.ts   # Text search functionality
├── store/                  # Pinia stores
│   ├── accessToken.ts      # Authentication token management
│   └── masterData.ts       # Master data management
└── type/                   # TypeScript type definitions
    ├── country.ts          # Country data types
    ├── searchedData.ts     # Search result types
    └── webCam.ts           # Webcam data types
```

## Setup & Installation

### Prerequisites
- Node.js (v16 or later recommended)
- npm or yarn
- API keys for:
  - Google Maps API
  - MongoDB
  - Other services as configured in `.env`

### Environment Configuration
Create a `.env` file in the root directory with the following variables:

```
# MongoDB
NUXT_MONGODB_KEY=your_mongodb_key
NUXT_MONGODB_ATLAS_TOKEN=your_mongodb_atlas_token
NUXT_MONGODB_ATLAS_GRAPHQL_URL=your_mongodb_graphql_url
NUXT_MONGODB_ATLAS_GRAPHQL_COUNTRY_URL=your_country_graphql_url

# Google Maps
NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Image Services
NUXT_PUBLIC_IMAGE_SERVER=your_image_server_url
NUXT_METAL_CLIENT_ID=your_metal_client_id
NUXT_METAL_SEARCHE_URL=your_metal_search_url
NUXT_METAL_IMAGE_INDEX=your_metal_image_index
NUXT_METAL_API_KEY=your_metal_api_key
NUXT_RESEMBLE_PIC_LAMBDA=your_resemble_pic_lambda

# Supabase
NUXT_PUBLIC_SUPABASE_URL=your_supabase_url
NUXT_PUBLIC_SUPABASE_KEY=your_supabase_key

# Translation
NUXT_PUBLIC_TRANSLATE_API=your_translate_api
```

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Map Navigation
1. The main page displays a map with webcam markers
2. Use the search bar to find specific locations
3. Click on webcam markers to view previews and access live feeds
4. Similar webcams will appear in the recommendations panel

### Search Interface
1. Navigate to the search page
2. Choose between country-based or text-based search
3. For country search: Select a country from the dropdown
4. For text search: Enter keywords and set the desired image count
5. Browse through results using pagination controls
6. Click on results to view on the map

## Testing

Run the test suite with:

```bash
npm run test
```

## Deployment

This application can be deployed using standard Nuxt deployment methods:

```bash
# Generate static files
npm run generate

# Deploy to GitHub Pages
npm run deploy
```

For more deployment options, refer to the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

## License

[Specify your license here]

## Acknowledgements

- [List any acknowledgements, libraries, or resources that were particularly helpful]
