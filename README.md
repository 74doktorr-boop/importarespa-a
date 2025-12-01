# Vehicle Import Analyzer

A modern web application to analyze vehicle advertisements and calculate Spanish import registration taxes.

## Features
- **Ad Analysis**: Extracts key data from vehicle ads (Make, Model, Price, Year, Mileage, CO2).
- **Tax Calculator**: Automatically calculates Spanish Registration Tax based on WLTP CO2 emissions.
- **Visualizations**: Animated gauges and premium UI components.
- **Tech Stack**: React, Tailwind CSS, Framer Motion, Node.js, Express.

## Project Structure
```
vehicle-analyzer/
├── backend/     # Node.js API for scraping/parsing
└── frontend/    # React + Vite Application
```

## Installation & Usage

### 1. Backend Setup
The backend handles the parsing logic.

```bash
cd backend
npm install
node index.js
```
The server will start on `http://localhost:3000`.

### 2. Frontend Setup
The frontend provides the user interface.

```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## Usage
1. Start both backend and frontend servers.
2. Open the frontend URL in your browser.
3. Paste a vehicle URL (e.g., from mobile.de) into the search bar.
   - *Note: If scraping fails or for testing, the backend will return mock data for demonstration purposes.*
4. View the analyzed data and calculated import tax.

## Tax Brackets (Spain)
- **0%**: ≤ 120 g/km CO2
- **4.75%**: 121 - 159 g/km CO2
- **9.75%**: 160 - 199 g/km CO2
- **14.75%**: ≥ 200 g/km CO2
