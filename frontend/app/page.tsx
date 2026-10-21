'use client';
import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Plus, X, AlertCircle, Info, Trash2, Package, LayoutDashboard, Apple, MapPin, Search, ShieldCheck, AlertTriangle } from 'lucide-react';

const fruitImages: Record<string, string> = {
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
};

const fruitGradients: Record<string, string> = {
  'Banana': 'linear-gradient(to right, #65a30d 0%, #a3e635 30%, #facc15 60%, #ca8a04 85%, #78350f 100%)',
  'Apple': 'linear-gradient(to right, #84cc16 0%, #facc15 30%, #ef4444 65%, #991b1b 85%, #581c87 100%)',
  'Avocado': 'linear-gradient(to right, #4ade80 0%, #16a34a 35%, #15803d 60%, #1c3b1e 80%, #18181b 100%)',
  'Mango': 'linear-gradient(to right, #65a30d 0%, #facc15 35%, #fb923c 65%, #ea580c 85%, #7c2d12 100%)',
  'Orange': 'linear-gradient(to right, #a3e635 0%, #facc15 30%, #fb923c 65%, #ea580c 85%, #9a3412 100%)',
  'Strawberry': 'linear-gradient(to right, #86efac 0%, #fca5a5 30%, #f87171 60%, #dc2626 85%, #7f1d1d 100%)',
  'Tomato': 'linear-gradient(to right, #84cc16 0%, #fde047 30%, #fb923c 60%, #ef4444 85%, #991b1b 100%)',
  'Peach': 'linear-gradient(to right, #bef264 0%, #fde047 35%, #f87171 65%, #ef4444 85%, #991b1b 100%)',
  'Lemon': 'linear-gradient(to right, #84cc16 0%, #bef264 30%, #facc15 65%, #eab308 85%, #a16207 100%)',
  'Cucumber': 'linear-gradient(to right, #86efac 0%, #22c55e 35%, #15803d 65%, #ca8a04 85%, #713f12 100%)'
};

interface PaletteColor {
  label: string;
  color: string;
  shade: number;
  stage: string;
}

const fruitPalettes: Record<string, PaletteColor[]> = {
  'Banana': [
    { label: 'Unripe Green', color: '#65a30d', shade: 10, stage: 'Underripe' },
    { label: 'Turning Yellow', color: '#a3e635', shade: 30, stage: 'Underripe' },
    { label: 'Bright Yellow', color: '#facc15', shade: 50, stage: 'Prime Ripe' },
    { label: 'Golden Honey', color: '#eab308', shade: 70, stage: 'Sweet Ripe' },
    { label: 'Sugar Spots / Brown', color: '#78350f', shade: 90, stage: 'Overripe' }
  ],
  'Apple': [
    { label: 'Crisp Green', color: '#84cc16', shade: 10, stage: 'Firm Unripe' },
    { label: 'Yellow Blush', color: '#facc15', shade: 30, stage: 'Turning' },
    { label: 'Ruby Red', color: '#ef4444', shade: 50, stage: 'Peak Crisp' },
    { label: 'Deep Crimson', color: '#991b1b', shade: 75, stage: 'Mature Ripe' },
    { label: 'Aged Dark', color: '#581c87', shade: 90, stage: 'Overripe' }
  ],
  'Avocado': [
    { label: 'Firm Bright Green', color: '#4ade80', shade: 10, stage: 'Hard' },
    { label: 'Olive Green', color: '#16a34a', shade: 35, stage: 'Firm Breaking' },
    { label: 'Dark Forest', color: '#15803d', shade: 55, stage: 'Yielding' },
    { label: 'Ripe Obsidian', color: '#1c3b1e', shade: 75, stage: 'Peak Creamy' },
    { label: 'Deep Charcoal', color: '#18181b', shade: 95, stage: 'Past Prime' }
  ],
  'Mango': [
    { label: 'Hard Green', color: '#65a30d', shade: 10, stage: 'Tart Unripe' },
    { label: 'Golden Glow', color: '#facc15', shade: 35, stage: 'Firming' },
    { label: 'Warm Orange', color: '#fb923c', shade: 55, stage: 'Peak Juicy' },
    { label: 'Deep Amber', color: '#ea580c', shade: 75, stage: 'Ultra Sweet' },
    { label: 'Soft Ochre', color: '#7c2d12', shade: 95, stage: 'Overripe' }
  ],
  'Orange': [
    { label: 'Green Tinted', color: '#a3e635', shade: 10, stage: 'Early Season' },
    { label: 'Citrus Yellow', color: '#facc15', shade: 30, stage: 'Turning' },
    { label: 'Vibrant Orange', color: '#fb923c', shade: 50, stage: 'Peak Sweet' },
    { label: 'Deep Sunkist', color: '#ea580c', shade: 70, stage: 'Heavy Juice' },
    { label: 'Dark Russet', color: '#9a3412', shade: 90, stage: 'Aged' }
  ],
  'Strawberry': [
    { label: 'White / Green Tip', color: '#86efac', shade: 15, stage: 'Immature' },
    { label: 'Blush Pink', color: '#fca5a5', shade: 35, stage: 'Turning' },
    { label: 'Bright Scarlet', color: '#f87171', shade: 55, stage: 'Prime Sweet' },
    { label: 'Deep Crimson', color: '#dc2626', shade: 75, stage: 'Soft Ripe' },
    { label: 'Dark Burgundy', color: '#7f1d1d', shade: 95, stage: 'Overripe' }
  ],
  'Tomato': [
    { label: 'Firm Green', color: '#84cc16', shade: 10, stage: 'Green' },
    { label: 'Breaker Yellow', color: '#fde047', shade: 30, stage: 'Breaker' },
    { label: 'Turning Orange', color: '#fb923c', shade: 50, stage: 'Turning' },
    { label: 'Vine Red', color: '#ef4444', shade: 70, stage: 'Ripe Red' },
    { label: 'Deep Soft Red', color: '#991b1b', shade: 90, stage: 'Overripe' }
  ],
  'Peach': [
    { label: 'Green Yellow', color: '#bef264', shade: 15, stage: 'Crisp Firm' },
    { label: 'Golden Sunset', color: '#fde047', shade: 35, stage: 'Giving' },
    { label: 'Rosy Blush', color: '#f87171', shade: 55, stage: 'Sweet Aromatic' },
    { label: 'Deep Velvet', color: '#ef4444', shade: 75, stage: 'Juicy Ripe' },
    { label: 'Bruised Plum', color: '#991b1b', shade: 95, stage: 'Overripe' }
  ],
  'Lemon': [
    { label: 'Lime Green', color: '#84cc16', shade: 10, stage: 'Tart Green' },
    { label: 'Yellow-Green', color: '#bef264', shade: 30, stage: 'Turning' },
    { label: 'Bright Lemon', color: '#facc15', shade: 50, stage: 'Fresh Ripe' },
    { label: 'Wax Golden', color: '#eab308', shade: 70, stage: 'Peak Juice' },
    { label: 'Aged Amber', color: '#a16207', shade: 90, stage: 'Drying' }
  ],
  'Cucumber': [
    { label: 'Pale Green', color: '#86efac', shade: 15, stage: 'Young' },
    { label: 'Crisp Fresh', color: '#22c55e', shade: 40, stage: 'Optimal Crisp' },
    { label: 'Deep Emerald', color: '#15803d', shade: 60, stage: 'Mature' },
    { label: 'Fading Yellow', color: '#ca8a04', shade: 80, stage: 'Yellowing' },
    { label: 'Soft Brown', color: '#713f12', shade: 95, stage: 'Spoiled' }
  ]
};

const getActivePaletteColor = (fruit: string, shade: number): PaletteColor => {
  const palette = fruitPalettes[fruit] || fruitPalettes['Apple'];
  let closest = palette[0];
  let minDiff = 999;
  for (const swatch of palette) {
    const diff = Math.abs(swatch.shade - shade);
    if (diff < minDiff) {
      minDiff = diff;
      closest = swatch;
    }
  }
  return closest;
};

const getDamageSeverity = (percent: number) => {
  if (percent === 0) return { label: 'Flawless (0%)', pill: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
  if (percent <= 20) return { label: `Minor (${percent}%)`, pill: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
  if (percent <= 50) return { label: `Moderate (${percent}%)`, pill: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-500' };
  return { label: `Severe (${percent}%)`, pill: 'text-red-700 bg-red-50 border-red-200', dot: 'bg-red-500' };
};

const getFruitImageUrl = (fruitName: string) => {
  return fruitImages[fruitName] || `/fruits/${fruitName}.png`;
};

interface PantryItem {
  id: number;
  name: string;
  area: string;
  quantity: number;
  shade_value: number;
  damage_percent: number;
  shade_coverage: number;
}

interface AnalysisResult {
  id: number;
  name: string;
  area: string;
  quantity: number;
  shade_value: number;
  damage_percent: number;
  remaining_days: number;
  total_life: number;
  health: number;
  status: string;
  color: string;
  type: string;
  optimal_temp: string;
  optimal_humidity: string;
  assessment: string;
  recommendation: string;
}

export default function Dashboard() {
  const [areas, setAreas] = useState<Record<string, { temp: number; humidity: number }>>({});
  const [items, setItems] = useState<PantryItem[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  
  // UI Navigation State
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [newZoneName, setNewZoneName] = useState<string>('');
  
  // Add Form State (Cleaned - No image in inventory add form)
  const [newFruit, setNewFruit] = useState<string>('Apple');
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newArea, setNewArea] = useState<string>(''); 
  const [shadeValue, setShadeValue] = useState<number>(50);
  const [damagePercent, setDamagePercent] = useState<number>(0);
  
  // Fullscreen Viewer State (For Location Views)
  const [viewerImage, setViewerImage] = useState<string | null>(null);

  const availableFruits = Object.keys(fruitImages);

  useEffect(() => {
    fetchAnalysis();
  }, [items, areas]);

  const fetchAnalysis = async () => {
    try {
      const backendUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8000` : 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/calculate-shelf-life`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areas, items, simulated_days: 0 }) 
      });
      const data = await res.json();
      setResults(data.items);
      setAlerts(data.alerts);
    } catch (err) {
      console.error("Failed to fetch from backend", err);
    }
  };

  const handleAddItem = () => {
    if (newQuantity > 0 && newArea) {
      const calculatedCoverage = Math.max(0, 100 - damagePercent);

      setItems([{ 
        name: newFruit, 
        area: newArea, 
        quantity: newQuantity, 
        id: Date.now(),
        shade_value: shadeValue,
        damage_percent: damagePercent,
        shade_coverage: calculatedCoverage,
      }, ...items]);
      
      setIsAddModalOpen(false);
      setNewQuantity(1);
      setShadeValue(50);
      setDamagePercent(0);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addZone = () => {
    if(newZoneName && !areas[newZoneName]) {
      setAreas({...areas, [newZoneName]: { temp: 20, humidity: 50 }});
      if (Object.keys(areas).length === 0) {
        setNewArea(newZoneName);
      }
      setNewZoneName('');
      setIsAddingLocation(false);
      setActiveTab(newZoneName);
    }
  };

  const removeZone = (zoneName: string) => {
    const newAreas = {...areas};
    delete newAreas[zoneName];
    setAreas(newAreas);
    setItems(items.filter(i => i.area !== zoneName));
    if(activeTab === zoneName) setActiveTab('Dashboard');
    
    if (newArea === zoneName) {
      const remainingAreas = Object.keys(newAreas);
      setNewArea(remainingAreas.length > 0 ? remainingAreas[0] : '');
    }
  };

  const updateArea = (name: string, field: 'temp' | 'humidity', val: string) => {
    setAreas({
      ...areas,
      [name]: { ...areas[name], [field]: parseInt(val) }
    });
  };

  const getResultForId = (id: number) => results.find(r => r.id === id);

  const displayedItems = (activeTab === 'Dashboard' 
    ? items 
    : items.filter(i => i.area === activeTab)
  ).filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.area.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeModalSwatch = getActivePaletteColor(newFruit, shadeValue);

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-[#111827] font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)] z-10">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2.5 font-bold text-lg text-gray-900 tracking-tight">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-sm">
              <Apple className="w-5 h-5" />
            </div>
            SpoilGuard
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-8">
          
          <div className="px-3">
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab('Dashboard')} 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'Dashboard' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <LayoutDashboard className="w-4 h-4" /> Inventory Dashboard
              </button>
            </div>
          </div>

          <div className="px-3">
            <h3 className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Storage Locations</h3>
            <div className="space-y-1">
              {Object.keys(areas).map(area => (
                <button 
                  key={area} 
                  onClick={() => setActiveTab(area)} 
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors group ${activeTab === area ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-gray-600" /> {area}
                  </div>
                  <span className="text-xs bg-gray-200/60 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                    {items.filter(i => i.area === area).length}
                  </span>
                </button>
              ))}
              
              {isAddingLocation ? (
                <div className="mt-3 px-1 animate-in slide-in-from-top-2 duration-200">
                  <input 
                    type="text" autoFocus placeholder="Name (e.g. Fridge)" 
                    value={newZoneName} onChange={e => setNewZoneName(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && addZone()} 
                    className="w-full text-sm border border-gray-300 rounded-md px-2.5 py-1.5 mb-2 outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm" 
                  />
                  <div className="flex gap-2">
                    <button onClick={addZone} className="text-xs bg-black text-white px-3 py-1.5 rounded-md flex-1 font-medium shadow-sm hover:bg-gray-800">Add</button>
                    <button onClick={() => setIsAddingLocation(false)} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md flex-1 font-medium hover:bg-gray-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingLocation(true)} 
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-3 border-2 border-dashed border-gray-300 rounded-md text-sm font-semibold text-gray-500 hover:text-black hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Location
                </button>
              )}
            </div>
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 relative z-0">
          <div className="flex items-center text-sm font-medium">
            <span className="text-gray-400">SpoilGuard</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">{activeTab}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 bg-gray-100 border border-transparent rounded-md pl-9 pr-4 py-1.5 text-sm outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-black/5 transition-all" 
              />
            </div>
            <button 
              onClick={() => {
                if (Object.keys(areas).length === 0) {
                  setIsAddingLocation(true);
                  alert("Please create a Storage Location first!");
                } else {
                  setIsAddModalOpen(true);
                }
              }} 
              className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded-md font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Food
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Page Title & Actions */}
            <div className="flex justify-between items-end pb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{activeTab}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === 'Dashboard' 
                    ? 'Central inventory table across all storage locations with real-time freshness telemetry.' 
                    : `Visual condition gallery and environmental climate controls for ${activeTab}.`}
                </p>
              </div>
              {activeTab !== 'Dashboard' && areas[activeTab] && (
                <button 
                  onClick={() => removeZone(activeTab)} 
                  className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete {activeTab}
                </button>
              )}
            </div>

            {/* Global Alerts (Visible on Dashboard) */}
            {alerts.length > 0 && activeTab === 'Dashboard' && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm">Action Required</h4>
                  <ul className="text-red-700 text-sm mt-1 space-y-1">
                    {alerts.map((alert, i) => <li key={i}>• {alert.replace(/[^\x00-\x7F]/g, '')}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Climate Controls (Only inside specific Storage Locations) */}
            {activeTab !== 'Dashboard' && areas[activeTab] && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-semibold text-gray-700">
                      <Thermometer className="w-4 h-4 text-gray-400"/> Temperature
                    </span>
                    <span className="text-gray-900 font-bold bg-gray-100 px-2.5 py-0.5 rounded-md">{areas[activeTab].temp}°C</span>
                  </div>
                  <input 
                    type="range" min="0" max="35" step="1" 
                    value={areas[activeTab].temp} onChange={(e) => updateArea(activeTab, 'temp', e.target.value)} 
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black" 
                  />
                </div>
                <div className="w-full md:w-px h-px md:h-10 bg-gray-200"></div>
                <div className="flex-1 w-full space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 font-semibold text-gray-700">
                      <Droplets className="w-4 h-4 text-blue-400"/> Humidity
                    </span>
                    <span className="text-gray-900 font-bold bg-gray-100 px-2.5 py-0.5 rounded-md">{areas[activeTab].humidity}%</span>
                  </div>
                  <input 
                    type="range" min="20" max="100" step="5" 
                    value={areas[activeTab].humidity} onChange={(e) => updateArea(activeTab, 'humidity', e.target.value)} 
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black" 
                  />
                </div>
              </div>
            )}

            {/* Empty States */}
            {Object.keys(areas).length === 0 ? (
              <div className="text-center py-24 border border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm">
                <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Welcome to SpoilGuard</h3>
                <p className="text-gray-500 text-sm mt-2 mb-6 max-w-sm mx-auto">
                  To start tracking your groceries, create your first storage location (like "Fridge", "Pantry", or "Fruit Bowl").
                </p>
                <button 
                  onClick={() => setIsAddingLocation(true)} 
                  className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm"
                >
                  Create Storage Location
                </button>
              </div>
            ) : displayedItems.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-300 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm">
                <Package className="w-10 h-10 text-gray-300 mb-3" />
                <h3 className="text-sm font-semibold text-gray-900">No items found</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">No produce matches your current view or filter.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)} 
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded-md font-medium text-sm transition-colors shadow-sm"
                >
                  Add produce
                </button>
              </div>
            ) : activeTab === 'Dashboard' ? (
              
              /* 1. INVENTORY VIEW (NO FRUIT IMAGES HERE - CLEAN DATA TABLE) */
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">Tracked Inventory</span>
                    <span className="text-xs bg-gray-200/80 text-gray-700 px-2 py-0.5 rounded-full font-semibold">
                      {displayedItems.length} items
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Produce images viewable in individual location tabs</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Produce</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Qty</th>
                        <th className="px-6 py-3">Ripeness (Base Shade)</th>
                        <th className="px-6 py-3">Damage %</th>
                        <th className="px-6 py-3">Shelf Life</th>
                        <th className="px-6 py-3">Health Status</th>
                        <th className="px-6 py-3">AI Recommendation</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedItems.map(item => {
                        const res = getResultForId(item.id);
                        const swatch = getActivePaletteColor(item.name, item.shade_value ?? 50);
                        const dmg = item.damage_percent ?? (100 - (item.shade_coverage ?? 100));
                        const damageSev = getDamageSeverity(dmg);

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                              {item.name}
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => setActiveTab(item.area)}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md border border-gray-200 transition-colors"
                              >
                                <MapPin className="w-3 h-3 text-gray-400" /> {item.area}
                              </button>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-700">
                              x{item.quantity}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs" style={{ backgroundColor: swatch.color }}></span>
                                {item.shade_value ?? 50}% • {swatch.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border shadow-2xs ${damageSev.pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${damageSev.dot}`}></span>
                                {dmg}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {res ? (
                                <div>
                                  <span className="font-extrabold text-gray-900 text-sm">{res.remaining_days} days</span>
                                  <span className="block text-[10px] text-gray-400">max {res.total_life}d</span>
                                </div>
                              ) : <span className="text-gray-400 text-xs">...</span>}
                            </td>
                            <td className="px-6 py-4 w-40">
                              {res ? (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[11px] font-bold">
                                    <span className="text-gray-600">{res.status}</span>
                                    <span className="text-gray-900">{res.health}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ 
                                        width: `${res.health}%`,
                                        backgroundColor: res.health > 50 ? '#10b981' : res.health > 20 ? '#f59e0b' : '#ef4444'
                                      }}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600 max-w-xs font-medium">
                              {res?.recommendation || 'Calculating...'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => removeItem(item.id)} 
                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              
              /* 2. LOCATION GALLERY VIEW (FRUIT IMAGES SHOWN PROMINENTLY HERE IN LOCATION) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedItems.map(item => {
                  const res = getResultForId(item.id);
                  const swatch = getActivePaletteColor(item.name, item.shade_value ?? 50);
                  const dmg = item.damage_percent ?? (100 - (item.shade_coverage ?? 100));
                  const damageSev = getDamageSeverity(dmg);

                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                      
                      {/* Fruit Image Section in Location */}
                      <div className="aspect-[4/3] w-full relative bg-gray-50 border-b border-gray-100 overflow-hidden group/image flex items-center justify-center p-3">
                        
                        {/* Soft ambient backlight tinted by base shade */}
                        <div 
                          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-500"
                          style={{
                            background: `radial-gradient(circle at center, ${swatch.color} 0%, transparent 70%)`
                          }}
                        />

                        {/* Fruit Image */}
                        <img 
                          src={getFruitImageUrl(item.name)} 
                          alt={item.name} 
                          className="w-full h-full object-contain object-center transition-transform duration-700 group-hover/image:scale-105 select-none" 
                        />
                        
                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/25 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/image:opacity-100 z-0">
                          <button 
                            onClick={() => setViewerImage(getFruitImageUrl(item.name))}
                            className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 transition-transform transform scale-90 group-hover/image:scale-100 shadow-xl border border-white/10"
                          >
                            <Search className="w-3.5 h-3.5" /> View Photo
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="absolute top-2 right-2 bg-white/95 p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all border border-gray-200/50 z-10"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {/* Quantity Tag */}
                        <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded-md text-xs font-bold text-gray-900 shadow-sm border border-gray-200/50 z-10">
                          x{item.quantity}
                        </div>
                      </div>
                      
                      {/* Location Card Body */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2.5">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                            
                            {/* Color Palette & Damage Indicators */}
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {/* Ripeness Swatch Pill */}
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs">
                                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" style={{ backgroundColor: swatch.color }}></span>
                                {item.shade_value ?? 50}% {swatch.stage}
                              </span>

                              {/* Damage Severity Pill */}
                              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border shadow-2xs ${damageSev.pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${damageSev.dot}`}></span>
                                {dmg}% Damage
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {res ? (
                          <div className="mt-auto space-y-3 pt-3 border-t border-gray-100">
                             <div className="flex justify-between items-end">
                                <div>
                                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Status</span>
                                  <span className="text-xs font-extrabold uppercase tracking-wide text-gray-800">{res.status}</span>
                                </div>
                                <div className="text-right">
                                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Expires in</span>
                                  <span className="text-sm font-extrabold text-black">{res.remaining_days} days</span>
                                </div>
                             </div>
                             
                             {/* Health Bar */}
                             <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{ 
                                    width: `${res.health}%`,
                                    backgroundColor: res.health > 50 ? '#10b981' : res.health > 20 ? '#f59e0b' : '#ef4444'
                                  }}
                                />
                             </div>

                             {/* Action Recommendation */}
                             {res.recommendation && (
                                <div className="bg-gray-50 p-2.5 rounded-md border border-gray-100 flex gap-2 items-start mt-2">
                                  <Info className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed">{res.recommendation}</p>
                                </div>
                             )}
                          </div>
                        ) : (
                          <div className="mt-auto pt-4 flex items-center justify-center text-xs text-gray-400 font-medium animate-pulse">
                            Processing AI Insights...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* MODAL FOR ADDING ITEMS (NO FRUIT IMAGE PREVIEW - CLEAN & COMPACT) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add Produce Item</h2>
                <p className="text-xs text-gray-500">Specify storage destination, base shade ripeness, and damage condition</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white border border-gray-200 rounded-md p-1 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Form Content */}
            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Type, Qty & Location */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Produce Type</label>
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm bg-white"
                    value={newFruit} onChange={e => { setNewFruit(e.target.value); setShadeValue(50); setDamagePercent(0); }}
                  >
                    {availableFruits.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Quantity</label>
                  <input 
                    type="number" min="1" max="99" value={newQuantity}
                    onChange={e => setNewQuantity(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 text-center focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Storage Destination</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm bg-white"
                  value={newArea} onChange={e => setNewArea(e.target.value)}
                >
                  {Object.keys(areas).length === 0 && <option value="" disabled>Please add a location first</option>}
                  {Object.keys(areas).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* COLOR PALETTE - BASE SHADE */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">Ripeness Color Palette (Base Shade)</label>
                    <span className="text-[11px] text-gray-500">Pick from the {newFruit} ripening spectrum:</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-2xs">
                    {shadeValue}% • {activeModalSwatch.stage}
                  </span>
                </div>

                {/* Palette Swatches */}
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {(fruitPalettes[newFruit] || fruitPalettes['Apple']).map((swatch, idx) => {
                    const isSelected = Math.abs(swatch.shade - shadeValue) <= 10;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setShadeValue(swatch.shade)}
                        className={`flex flex-col items-center p-2 rounded-lg border text-center transition-all group ${
                          isSelected 
                            ? 'border-black bg-white ring-2 ring-black/10 shadow-sm scale-102' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border border-black/15 shadow-sm transition-transform group-hover:scale-110 mb-1.5" 
                          style={{ backgroundColor: swatch.color }}
                        />
                        <span className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-1">{swatch.label}</span>
                        <span className="text-[9px] text-gray-400 mt-0.5">{swatch.shade}%</span>
                      </button>
                    );
                  })}
                </div>

                {/* Continuous Base Shade Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="relative h-2.5 w-full rounded-full shadow-inner" style={{ background: fruitGradients[newFruit] }}>
                    <input 
                      type="range" min="0" max="100" value={shadeValue} 
                      onChange={(e) => setShadeValue(parseInt(e.target.value))} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full pointer-events-none shadow-md transition-transform" 
                      style={{ left: `calc(${shadeValue}% - 8px)` }} 
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
                    <span>Underripe (0%)</span>
                    <span>Peak Ripe (50%)</span>
                    <span>Overripe (100%)</span>
                  </div>
                </div>
              </div>

              {/* DAMAGE / DEFECT PERCENTAGE */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-[11px] font-bold text-gray-800 uppercase tracking-wider block">Physical Damage / Bruising (%)</label>
                    <span className="text-[11px] text-gray-500">Surface cuts, soft spots, or bruising:</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border shadow-2xs ${getDamageSeverity(damagePercent).pill}`}>
                    {damagePercent}%
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5">
                  {[
                    { label: '0% Flawless', val: 0 },
                    { label: '15% Minor', val: 15 },
                    { label: '35% Moderate', val: 35 },
                    { label: '60% Heavy', val: 60 },
                    { label: '85% Severe', val: 85 }
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setDamagePercent(preset.val)}
                      className={`flex-1 text-[11px] py-1.5 rounded-md font-semibold border transition-all ${
                        damagePercent === preset.val
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <div className="space-y-1 pt-1">
                  <input 
                    type="range" min="0" max="100" step="5" value={damagePercent} 
                    onChange={(e) => setDamagePercent(parseInt(e.target.value))} 
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black" 
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium px-0.5">
                    <span>0% Clean</span>
                    <span>50% Bruised</span>
                    <span>100% Decomposed</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="text-[11px] font-medium text-gray-600 bg-white border border-gray-200 p-2.5 rounded-md flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getDamageSeverity(damagePercent).dot}`}></span>
                  {damagePercent === 0 && "Zero physical damage: Skin and pulp are completely firm and unbruised."}
                  {damagePercent > 0 && damagePercent <= 20 && "Slight surface scuffing or small mild bruise; minimal impact on shelf life."}
                  {damagePercent > 20 && damagePercent <= 50 && "Moderate bruising and soft spots; decay progression accelerated."}
                  {damagePercent > 50 && "Extensive bruising or skin tears; high risk of mold and bacterial spoilage."}
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="px-5 py-4 bg-white border-t border-gray-200 flex justify-end gap-3 rounded-b-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddItem}
                disabled={Object.keys(areas).length === 0}
                className="px-6 py-2 text-sm font-semibold bg-black hover:bg-gray-800 text-white rounded-md transition-colors shadow-sm disabled:opacity-50"
              >
                Save & Add Food
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE VIEWER MODAL (FOR LOCATION INSPECTION) */}
      {viewerImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setViewerImage(null)}>
          <div className="absolute top-6 right-6 z-10">
            <button 
              onClick={() => setViewerImage(null)} 
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-6 left-6 text-white z-10 pointer-events-none">
            <h2 className="text-2xl font-bold tracking-tight">Produce Inspection</h2>
            <p className="text-sm text-gray-300 mt-1 font-medium">Full resolution fruit image in location.</p>
          </div>
          <div className="max-w-4xl max-h-[80vh] flex items-center justify-center p-8">
            <img src={viewerImage} alt="Fullscreen item" className="max-w-full max-h-full rounded-lg shadow-2xl object-contain border border-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}
