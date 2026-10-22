# LoopLocal 

**CPU4106 Group Project**

LoopLocal is a simple recycling website that helps people sort their waste, find drop-off centres and join their local community. It supports **UN Sustainable Development Goal 11** (Sustainable Cities and Communities).

## Pages

| Page | What it does |
| --- | --- |
| **Home** (`index.html`) | Welcome page with an impact dashboard, charts and latest news |
| **About** (`about.html`) | Our mission and how LoopLocal works (Sort → Drop off → Reprocess) |
| **Sorting Guide** (`sorting-guide.html`) | Search and filter items to see how to recycle them |
| **Centers** (`centers.html`) | Map of recycling centres with a postcode search and booking form |
| **Booking** (`booking.html`) | Shows your booking receipt and booking code |
| **Community** (`community.html`) | Volunteer sign-up, free items board and repair cafes |

## Features

- **Impact dashboard:** log items you recycle and see charts and CO₂ saved
- **Sorting guide:** search and filter by category (plastic, glass, metal, etc.)
- **Interactive map:** search a postcode and book a visit to a centre
- **Booking receipt:** shows your booking code and details
- **Responsive design:** works on desktop and mobile, with a bottom navigation bar

## Technologies Used

**Languages**
- HTML
- CSS
- JavaScript

**Libraries**
- [Chart.js](https://www.chartjs.org/) for the dashboard charts
- [Leaflet](https://leafletjs.com/) to display the interactive map
- [Flatpickr](https://flatpickr.js.org/) for the booking date picker

**APIs and Services**
- [OpenStreetMap](https://www.openstreetmap.org/) provides the map tiles shown in Leaflet
- [Nominatim API](https://nominatim.org/) converts a postcode or place name into map coordinates (used in the centre search)

**Fonts**
- Baloo 2 and Nunito (saved locally in the `fonts` folder)

## Folder Structure

```
GrouP Project/
├── css/          styles.css
├── fonts/        font files
├── html-files/   all the web pages
├── images/       logo and background images
└── js/           main.js, map.js, booking.js
```

## How to Run

1. Download or clone the project.
2. Open the `html-files` folder.
3. Open `index.html` in your browser.

You need an internet connection for the map, postcode search, charts and date picker to work.

## Notes

- Your recycling log and bookings are saved in your browser (`localStorage`), so there is no database or login.
- The recycling centres and impact numbers (like 1,250 kg) are example data for this project.

## Team

•	Tudor Sirbu
•	Vlad-Alexandru Enache
•	Helen-Anca Dimitriu
•	Cosmin Floare

## Copyright

© 2026 LoopLocal · CPU4106 Group Project
