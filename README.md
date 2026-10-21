# SpoilGuard: ML-Driven Food Spoilage Predictor & Pantry Health System

> **The system provides users with an intuitive dashboard and proactive AI-driven recommendations (e.g., Store, Eat Now, Donate to Food Bank, or Compost), ultimately extending grocery lifespan and drastically reducing household food waste.**

---

## 📌 Overview

Household food waste is predominantly driven by invisible biochemical decay and suboptimal microclimatic storage. **SpoilGuard** addresses this problem by combining:
1. **UC Davis Postharvest Biochemical Modeling**: Real-time cross-ethylene production, chilling injury threshold modeling, and humidity-driven shrivel/mold tracking.
2. **Dual-Model Machine Learning Engine**:
   - **Lifespan Regressor (Random Forest)**: Multi-parameter nonlinear regression forecasting exact remaining shelf-life days.
   - **Proactive Action Classifier (Random Forest)**: Recommends precise consumer actions (*Store / Eat Fresh*, *Perfect for Eating Now*, *Donate to Food Bank / Cook ASAP*, or *Compost / Discard*).
3. **Dynamic Ripeness Color Palettes**: Dedicated 5-stage base shade spectra customized per fruit type (from immature green to peak wax and sugar-spot decay).
4. **Physical Damage Penalty Engine**: Quantitative scoring of surface lesions, bruising, and punctures directly integrated into decay velocity curves.
5. **Modern Dual-View Dashboard**: Central inventory table for high-density overview coupled with visual condition galleries per storage location (Fridge, Pantry, Fruit Bowl).

---

## 🚀 Key Features

* **Biochemical Ethylene Simulation**: Tracks climatic interactions between ethylene producers (e.g., Apples, Bananas, Avocados) and sensitive produce (e.g., Cucumbers, Peaches) sharing the same storage location.
* **Storage Location Climate Telemetry**: Custom temperature (°C) and humidity (%) settings per location with automatic chilling injury and mold danger alerts.
* **Ripeness Color Spectrum (Base Shade)**: Interactive 5-stage color palettes specific to each produce type with synchronized continuous gradient sliders.
* **Surface Damage Quantifier**: Preset and continuous physical damage scoring (`0% Flawless` to `100% Decomposed`) that dynamically scales decay kinetics.
* **Location-Only Visuals**: High-resolution fruit images with ambient base-shade backlights are showcased exclusively within their storage locations, keeping the central inventory clean and fast.
* **Proactive Action Recommendations**: Direct guidance to donate consumable surplus before spoilage occurs or salvage overripe produce through cooking.

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  SpoilGuard Next.js Frontend                 │
   │      - Central Inventory Table & Search Filter              │
   │      - Storage Location Photo Galleries                     │
   │      - Ripeness Color Palette & Damage Selector              │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ JSON API (CORS)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                    FastAPI ML Logic Engine                  │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │             Biochemical Knowledge Engine              │  │
   │  │   - Ethylene sensitivity & production rates           │  │
   │  │   - Temperature & humidity microclimate bounds        │  │
   │  └───────────────────────────┬───────────────────────────┘  │
   │                              ▼                              │
   │  ┌───────────────────────────────────────────────────────┐  │
   │  │            Random Forest Regressor & Classifier       │  │
   │  │   - Predicts exact remaining shelf life days          │  │
   │  │   - Action: Store | Eat Now | Donate | Compost        │  │
   │  └───────────────────────────────────────────────────────┘  │
   └─────────────────────────────────────────────────────────────┘
```

* **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Lucide Icons
* **Backend**: FastAPI, Uvicorn, Python 3.11+
* **Machine Learning**: Scikit-Learn (Random Forest Regressor & Classifier), NumPy
* **Image Processing**: Pillow, OpenCV Telea Inpainting

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: v18+ and `npm`
* **Python**: v3.10+

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install required dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* Backend API runs on: `http://localhost:8000`
* Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
* Frontend Dashboard runs on: `http://localhost:3000`

---

## 📊 Supported Produce & Biochemical Profiles

| Produce | Classification | Base Shelf-Life | Ethylene Producer | Ethylene Sensitive | Optimal Temp Range |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Apple** | Producer | 30 days | High (4.0) | Low (1.0) | 0°C – 4°C |
| **Banana** | Producer | 14 days | Medium (3.0) | High (5.0) | 13°C – 15°C |
| **Avocado** | Producer | 14 days | High (4.0) | High (5.0) | 5°C – 13°C |
| **Mango** | Producer | 14 days | Low-Medium (2.0) | High (4.0) | 10°C – 13°C |
| **Orange** | Neutral | 30 days | Negligible (0.1) | Low (1.0) | 3°C – 8°C |
| **Strawberry** | Neutral | 7 days | Negligible (0.1) | Low (1.0) | 0°C – 2°C |
| **Tomato** | Producer | 14 days | Medium (3.0) | Medium (3.0) | 10°C – 15°C |
| **Peach** | Producer | 14 days | Very High (5.0) | High (5.0) | 0°C – 2°C |
| **Lemon** | Neutral | 30 days | Negligible (0.1) | Medium (2.0) | 12°C – 14°C |
| **Cucumber** | Sensitive | 14 days | Negligible (0.1) | Extreme (5.0) | 10°C – 12°C |

---

## 📄 License
MIT License. Created by [Vedant Sakpal](https://github.com/Vedantsakpal24).
