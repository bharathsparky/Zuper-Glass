# Zuper Go Mobile App

A mobile-first React application recreating the Zuper Go design from Figma.

## Features

- Mobile-optimized UI (393px width)
- Glass morphism effects
- Gradient cards
- Responsive layout
- Modern design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy Figma assets to `public/assets/` directory:
   - The assets should be copied from `/tmp/figma-assets/` to `public/assets/`
   - Or download them from Figma and place them in the `public/assets/` folder

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
zuper-go-mobile/
├── public/
│   └── assets/          # Image assets from Figma
├── src/
│   ├── components/
│   │   └── svg-ijpem.jsx  # SVG icon components
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- PostCSS
- Autoprefixer

## Notes

- The design is optimized for mobile devices (393px width)
- Some assets may need to be downloaded from Figma if not present in `/tmp/figma-assets/`
- The app uses custom fonts (SF Pro, Inter, Space Grotesk, Raleway) - ensure these are available or use fallbacks

