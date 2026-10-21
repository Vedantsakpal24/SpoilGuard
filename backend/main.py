from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
from fastapi.middleware.cors import CORSMiddleware
import math
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

# --- ML Model Setup ---
# Train a simple Random Forest on synthetic data to predict health multiplier
def train_shelf_life_model():
    X, y = [], []
    import random
    for _ in range(2000):
        t = random.uniform(-5, 40)
        h = random.uniform(20, 100)
        e = random.uniform(0, 10)
        s = random.uniform(0, 100)
        
        temp_mult = 1.0
        if t < 0: temp_mult = 0.3
        elif t > 25: temp_mult = max(0.1, 1.0 - (t-25)/20)
        else: temp_mult = 1.2
        
        hum_mult = 1.0
        if h < 60: hum_mult = 0.7
        elif h > 90 and t > 18: hum_mult = 0.6
        
        eth_mult = max(0.2, 1.0 - (e / 20.0))
        
        shade_mult = 1.0
        if s < 40: shade_mult = 1.0 + ((40 - s) / 40.0) * 0.4
        elif s > 60: shade_mult = max(0.1, 1.0 - ((s - 60) / 40.0) * 0.9)
        
        target = temp_mult * hum_mult * eth_mult * shade_mult
        X.append([t, h, e, s])
        y.append(target)
        
    model = RandomForestRegressor(n_estimators=20, random_state=42)
    model.fit(X, y)
    return model

# Train a classifier to recommend actions (for reducing waste / donation)
def train_action_classifier():
    X, y = [], []
    import random
    for _ in range(2000):
        health = random.uniform(0, 100)
        rem_days = random.uniform(-2, 30)
        ethylene = random.uniform(0, 10)
        shade = random.uniform(0, 100)
        
        if health <= 5 or rem_days < 0.5 or shade > 85:
            target = 0 # Compost
        elif health <= 25 or rem_days <= 3.0:
            target = 1 # Urgent / Donate
        elif health <= 70 and 35 <= shade <= 65:
            target = 2 # Perfect
        else:
            target = 3 # Store / Fresh
            
        X.append([health, rem_days, ethylene, shade])
        y.append(target)
        
    clf = RandomForestClassifier(n_estimators=20, random_state=42)
    clf.fit(X, y)
    return clf

ml_model = train_shelf_life_model()
action_clf = train_action_classifier()

ACTION_LABELS = {
    0: "Compost / Discard",
    1: "Donate to Food Bank / Cook ASAP",
    2: "Perfect for Eating Now",
    3: "Store / Eat Fresh"
}
app = FastAPI(title="SpoilGuard API: ML-Driven Food Spoilage Predictor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StorageArea(BaseModel):
    temp: float
    humidity: float

class FruitItem(BaseModel):
    id: int
    name: str
    area: str
    quantity: int = 1
    quality_multiplier: float = 1.0
    quality_assessment: Optional[str] = None
    shade_value: int = 50
    shade_coverage: int = 100
    damage_percent: Optional[float] = 0.0

class PantryRequest(BaseModel):
    areas: Dict[str, StorageArea]
    items: List[FruitItem]
    simulated_days: int = 0

# Advanced Biochemical Knowledge Base (Sourced from UC Davis Postharvest Technology)
# eth_rate: Ethylene production rate per item (relative scale 0-5)
# sens: Sensitivity to ethylene (relative scale 0-5, higher = rots faster when exposed)
# min_t / max_t: Optimal temperature range (°C)
FRUIT_DATA = {
    "apple": {"type": "Producer", "base_life": 30, "eth_rate": 4.0, "sens": 1.0, "min_t": 0, "max_t": 4, "cold_sens": False},
    "banana": {"type": "Producer", "base_life": 14, "eth_rate": 3.0, "sens": 5.0, "min_t": 13, "max_t": 15, "cold_sens": True},
    "avocado": {"type": "Producer", "base_life": 14, "eth_rate": 4.0, "sens": 5.0, "min_t": 5, "max_t": 13, "cold_sens": True},
    "mango": {"type": "Producer", "base_life": 14, "eth_rate": 2.0, "sens": 4.0, "min_t": 10, "max_t": 13, "cold_sens": True},
    "orange": {"type": "Neutral", "base_life": 30, "eth_rate": 0.1, "sens": 1.0, "min_t": 3, "max_t": 8, "cold_sens": False},
    "strawberry": {"type": "Neutral", "base_life": 7, "eth_rate": 0.1, "sens": 1.0, "min_t": 0, "max_t": 2, "cold_sens": False},
    "tomato": {"type": "Producer", "base_life": 14, "eth_rate": 3.0, "sens": 3.0, "min_t": 10, "max_t": 15, "cold_sens": True},
    "peach": {"type": "Producer", "base_life": 14, "eth_rate": 5.0, "sens": 5.0, "min_t": 0, "max_t": 2, "cold_sens": True},
    "lemon": {"type": "Neutral", "base_life": 30, "eth_rate": 0.1, "sens": 2.0, "min_t": 12, "max_t": 14, "cold_sens": True},
    "cucumber": {"type": "Sensitive", "base_life": 14, "eth_rate": 0.1, "sens": 5.0, "min_t": 10, "max_t": 12, "cold_sens": True},
}

@app.post("/api/calculate-shelf-life")
async def calculate_shelf_life(req: PantryRequest):
    # Calculate Total Ethylene Production per Area
    area_ethylene = {area_name: 0.0 for area_name in req.areas.keys()}
    for item in req.items:
        if item.area in area_ethylene:
            name = item.name.lower()
            data = FRUIT_DATA.get(name, {"eth_rate": 0})
            area_ethylene[item.area] += data.get("eth_rate", 0) * item.quantity
        
    results = []
    alerts = []
    
    for item in req.items:
        if item.area not in req.areas:
            continue
            
        name = item.name.lower()
        area = item.area
        env = req.areas[area]
        temp = env.temp
        humidity = env.humidity
        
        data = FRUIT_DATA.get(name, {
            "type": "Neutral", "base_life": 7, "eth_rate": 0, "sens": 1, 
            "min_t": 10, "max_t": 25, "cold_sens": False
        })
        
        # 1. Advanced Ethylene Impact based on Concentration
        external_ethylene = max(0, area_ethylene[area] - (data["eth_rate"] * item.quantity))
        
        ethylene_multiplier = 1.0
        if external_ethylene > 0:
            impact = (external_ethylene * data["sens"]) / 20.0 
            ethylene_multiplier = max(0.2, 1.0 - impact)
            if impact > 0.3:
                alerts.append(f"⚠️ High Ethylene in {area}! {item.name} is degrading quickly.")

        # 2. Alerts logic
        if data["cold_sens"] and temp < data["min_t"]:
            alerts.append(f"❄️ Chilling Injury: {item.name} in {area} is below its safe temp of {data['min_t']}°C.")
        
        if humidity < 60:
            alerts.append(f"🏜️ Low humidity in {area} is causing {item.name} to shrivel.")
        elif humidity > 90 and temp > 18:
            alerts.append(f"💧 High heat + humidity in {area} = mold risk for {item.name}.")

        # Determine damage percentage
        damage = 0.0
        if item.damage_percent is not None:
            damage = float(item.damage_percent)
        elif item.shade_coverage is not None:
            damage = max(0.0, 100.0 - float(item.shade_coverage))
        damage = max(0.0, min(100.0, damage))

        # --- DYNAMIC QUALITY ENGINE (COLOR + DAMAGE) ---
        # Effective shade combines base ripeness shade and surface damage
        overall_shade = (item.shade_value * ((100.0 - damage) / 100.0)) + (95.0 * (damage / 100.0))
        
        # Base ripeness description
        if item.shade_value < 35:
            ripeness_str = "Underripe"
        elif item.shade_value <= 65:
            ripeness_str = "Peak Ripe"
        elif item.shade_value <= 85:
            ripeness_str = "Overripe"
        else:
            ripeness_str = "Decaying"

        # Combine with physical damage assessment
        if damage >= 50:
            assessment = f"Heavy Damage ({int(damage)}%) - {ripeness_str}"
        elif damage >= 20:
            assessment = f"Moderate Bruising ({int(damage)}%) - {ripeness_str}"
        elif damage > 0:
            assessment = f"Minor Blemish ({int(damage)}%) - {ripeness_str}"
        else:
            assessment = f"Flawless (0% Damaged) - {ripeness_str}"

        # --- ML PREDICTION ---
        features = np.array([[temp, humidity, external_ethylene, overall_shade]])
        predicted_multiplier = float(ml_model.predict(features)[0])
        
        # Physical damage significantly reduces shelf life
        damage_multiplier = max(0.05, 1.0 - (damage / 100.0) * 0.85)

        # Calculate absolute maximum lifespan
        final_max_life = data["base_life"] * predicted_multiplier * damage_multiplier
        
        # Calculate simulation state
        sim_days = req.simulated_days
        remaining_days = max(0.0, final_max_life - sim_days)
        
        health_percentage = 0
        if data["base_life"] > 0:
            # Absolute health compared to optimal base life
            health_percentage = min(100.0, (remaining_days / data["base_life"]) * 100)

        # Determine qualitative status based on absolute health
        if remaining_days <= 0 or health_percentage <= 5:
            status = "SPOILED"
            color = "red"
        elif health_percentage < 25:
            status = "DEGRADING"
            color = "orange"
        elif health_percentage < 65:
            status = "RIPE"
            color = "yellow"
        else:
            status = "FRESH"
            color = "emerald"
            
        # --- ML ACTION RECOMMENDATION ---
        action_features = np.array([[health_percentage, remaining_days, external_ethylene, overall_shade]])
        action_class = int(action_clf.predict(action_features)[0])
        recommendation = ACTION_LABELS.get(action_class, "Unknown")
            
        results.append({
            "id": item.id,
            "name": item.name,
            "area": area,
            "quantity": item.quantity,
            "shade_value": item.shade_value,
            "damage_percent": round(damage, 1),
            "remaining_days": round(remaining_days, 1),
            "total_life": round(final_max_life, 1),
            "health": round(health_percentage),
            "status": status,
            "color": color,
            "type": data["type"],
            "optimal_temp": f"{data.get('min_t', 0)}°C - {data.get('max_t', 0)}°C",
            "optimal_humidity": "90% - 95%",
            "assessment": assessment,
            "recommendation": recommendation
        })
        
    return {
        "items": results,
        "alerts": list(set(alerts)) 
    }

import requests
import io
import base64
from PIL import Image, ImageDraw

fruitImages = {
  'Banana': '/fruits/Banana.png',
  'Apple': '/fruits/Apple.png',
  'Avocado': '/fruits/Avocado.png',
  'Mango': '/fruits/Mango.png',
  'Orange': '/fruits/Orange.png',
  'Strawberry': '/fruits/Strawberry.png',
  'Tomato': '/fruits/Tomato.png',
  'Peach': '/fruits/Peach.png',
  'Lemon': '/fruits/Lemon.png',
  'Cucumber': '/fruits/Cucumber.png'
}

SPOT_TYPES = {
  'bruise': {'color': (139, 69, 19, 178), 'size': 80, 'blend': 'multiply'},
  'rot': {'color': (40, 20, 10, 216), 'size': 50, 'blend': 'multiply'},
  'mold': {'color': (230, 240, 230, 229), 'size': 40, 'blend': 'normal'}
}

class Spot(BaseModel):
    x: float
    y: float
    type: str

class RenderRequest(BaseModel):
    fruit_name: str
    spots: List[Spot]

def apply_multiply_blend(base_img, overlay_img):
    base_data = np.array(base_img, dtype=np.float32) / 255.0
    over_data = np.array(overlay_img, dtype=np.float32) / 255.0
    alpha_over = over_data[..., 3:4]
    color_over = over_data[..., 0:3]
    color_base = base_data[..., 0:3]
    blended_color = color_base * color_over
    out_color = blended_color * alpha_over + color_base * (1 - alpha_over)
    out_alpha = base_data[..., 3:4] + alpha_over * (1 - base_data[..., 3:4])
    out = np.concatenate((out_color, out_alpha), axis=-1)
    out = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

from fastapi.responses import Response

import os

@app.get("/api/image/{fruit_name}")
async def get_fruit_image(fruit_name: str):
    if fruit_name not in fruitImages:
        return Response(status_code=404)
        
    try:
        filepath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', fruitImages[fruit_name].lstrip('/')))
        with open(filepath, 'rb') as f:
            content = f.read()
            
        return Response(content=content, media_type='image/png')
    except Exception as e:
        print(f"Failed to fetch proxy image for {fruit_name}: {e}")
        return Response(status_code=500)

@app.post("/api/render-fruit")
async def render_fruit(req: RenderRequest):
    if req.fruit_name not in fruitImages:
        return {"image": None}
    
    try:
        filepath = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', fruitImages[req.fruit_name].lstrip('/')))
        with open(filepath, 'rb') as f:
            base = Image.open(f).convert("RGBA")
    except Exception as e:
        print(f"Failed to load local file for {req.fruit_name}: {e}")
        return {"image": None}
        
    orig_w, orig_h = base.size
    target_ratio = 4.0 / 3.0
    orig_ratio = orig_w / orig_h
    
    if orig_ratio > target_ratio:
        new_w = orig_w
        new_h = int(orig_w / target_ratio)
    else:
        new_h = orig_h
        new_w = int(orig_h * target_ratio)
        
    new_base = Image.new("RGBA", (new_w, new_h), (0, 0, 0, 0))
    new_base.paste(base, ((new_w - orig_w) // 2, (new_h - orig_h) // 2))
    base = new_base
    
    width, height = base.size
    
    for spot in req.spots:
        stype = SPOT_TYPES.get(spot.type)
        if not stype: continue
        
        overlay = Image.new('RGBA', (width, height), (0,0,0,0))
        draw = ImageDraw.Draw(overlay)
        
        x = (spot.x / 100.0) * width
        y = (spot.y / 100.0) * height
        radius = (stype['size'] / 2.0) * (width / 400.0)
        
        for r in range(int(radius), 0, -1):
            alpha = int(stype['color'][3] * (1 - r/radius))
            color = (stype['color'][0], stype['color'][1], stype['color'][2], alpha)
            draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
            
        if stype['blend'] == 'multiply':
            base = apply_multiply_blend(base, overlay)
        else:
            base = Image.alpha_composite(base, overlay)
            
    final = base.convert("RGB")
    buffered = io.BytesIO()
    final.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return {"image": f"data:image/png;base64,{img_str}"}
