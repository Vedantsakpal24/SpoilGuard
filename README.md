# SpoilGuard AI: A Machine Learning Approach to Predicting Shelf-Life and Reducing Food Waste

This is an advanced, AI-driven web application that helps users optimize grocery storage based on biochemical compatibility, real-time conditions, and Machine Learning models.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Python (FastAPI)
- **Database**: MongoDB Atlas (Mongoose)
- **External API**: Open-Meteo

## Project Structure
- `/frontend`: Next.js web application. Includes the interactive dashboard UI (`app/page.tsx`) and the Mongoose schema (`models/UserPantry.js`).
- `/backend`: Python FastAPI logic engine. Includes weather API integration and biochemical compatibility logic (`main.py`).

## How to Run locally

### Backend
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment
4. Install dependencies: `pip install -r requirements.txt`
5. Start the server: `uvicorn main:app --reload`
6. The API will be available at `http://localhost:8000`

### Frontend
1. Navigate to `frontend/`
2. Initialize project (if not done): `npx create-next-app@latest .`
3. Install dependencies: `npm install mongoose`
4. Start development server: `npm run dev`
5. Visit `http://localhost:3000`

## Deployment Strategy
- **Frontend**: Deploy the `/frontend` directory directly to Vercel. Setup MongoDB Atlas connection strings as environment variables (`MONGODB_URI`) in Vercel settings.
- **Backend**: Deploy the `/backend` directory to Render using a Web Service. Render natively supports `requirements.txt` and FastAPI. Set up the start command as `uvicorn main:app --host 0.0.0.0 --port $PORT`.

