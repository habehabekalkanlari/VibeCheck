import time
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VibeCheck API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- In-memory store (seeded with demo data) ----------

HOUR = 3600 * 1000
now_ms = lambda: int(time.time() * 1000)

SONGS = [
    {"id": "s-1", "title": "505", "artist": "Arctic Monkeys", "album": "Favourite Worst Nightmare",
     "coverUrl": "/src/assets/images/vibe_cover_indie_night_1791203363549.jpg",
     "durationSec": 253, "bpm": 140, "genre": "indie", "service": "spotify",
     "vibeColor": "#0ea5e9", "previewSynthPreset": "indie"},
    {"id": "s-2", "title": "Koca Bir Saçmalık", "artist": "Jakuzi", "album": "Fantezi Müzik",
     "coverUrl": "/src/assets/images/vibe_cover_anatolian_rock_1791203413631.jpg",
     "durationSec": 214, "bpm": 124, "genre": "indie", "service": "spotify",
     "vibeColor": "#f97316", "previewSynthPreset": "synthwave"},
    {"id": "s-3", "title": "Danielle (smile on my face)", "artist": "Fred Again..", "album": "Actual Life 3",
     "coverUrl": "/src/assets/images/vibe_cover_techno_berlin_1791203376650.jpg",
     "durationSec": 201, "bpm": 132, "genre": "techno", "service": "apple-music",
     "vibeColor": "#8b5cf6", "previewSynthPreset": "techno"},
    {"id": "s-4", "title": "Coffee Beans & Rain", "artist": "ChilledCow / Lofi Girl", "album": "1 A.M Study Session",
     "coverUrl": "/src/assets/images/vibe_cover_lofi_sunset_1791203398678.jpg",
     "durationSec": 184, "bpm": 82, "genre": "lofi", "service": "spotify",
     "vibeColor": "#eab308", "previewSynthPreset": "lofi"},
    {"id": "s-5", "title": "İstikrarlı Hayal Hakikattir", "artist": "Gaye Su Akyol",
     "album": "İstikrarlı Hayal Hakikattir",
     "coverUrl": "/src/assets/images/vibe_cover_anatolian_rock_1791203413631.jpg",
     "durationSec": 228, "bpm": 118, "genre": "rock", "service": "spotify",
     "vibeColor": "#ec4899", "previewSynthPreset": "rock"},
]

USERS_DB = {
    "usr-self": {
        "id": "usr-self", "name": "Kaan Demir", "handle": "@kaan_vibes",
        "isAnonymousDefault": False, "connectedService": "spotify",
        "stats": {"totalSpheresDropped": 28, "flashChatsStarted": 14,
                  "topVibeGenre": "İndie & Lo-Fi", "currentFrequencyScore": 92},
        "recentMoodBreakdown": [
            {"label": "Melankolik & Sakin", "percent": 45, "color": "#38bdf8"},
            {"label": "Gece & Elektronik", "percent": 35, "color": "#a855f7"},
            {"label": "Enerjik & Keşif", "percent": 20, "color": "#f59e0b"},
        ],
    }
}

_t = now_ms()
SPHERES_DB: dict[str, dict] = {}

SEED_SPHERES = [
    {
        "id": "sphere-1",
        "user": {"id": "u-1", "name": "Ece Yıldız", "handle": "@ece_y", "isAnonymous": False,
                 "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"},
        "song": SONGS[1], "moodTags": ["melankolik", "rüzgar", "anadolu"],
        "note": "Moda sahilinde kayalıklarda gün batımı... tam bu parça.",
        "location": {"name": "Moda Sahili Kayalıklar", "neighborhood": "Moda, Kadıköy", "city": "İstanbul",
                     "lat": 40.9845, "lng": 29.028, "distanceMeters": 340},
        "createdAt": _t - 25 * 60000, "expiresAt": _t + 95 * 60000,
        "energyLevel": 3, "resonanceScore": 96, "activeListenersCount": 6, "hasActiveFlashChat": True,
    },
    {
        "id": "sphere-2",
        "user": {"id": "u-anon-2", "name": "Gizemli Dinleyici", "handle": "@anon_kadikoy", "isAnonymous": True},
        "song": SONGS[3], "moodTags": ["kahve", "lo-fi", "finaller"],
        "note": "Üçüncü fincan filtre kahve, kod satırları arasında kayboldum.",
        "location": {"name": "Montag Coffee Roasters", "neighborhood": "Caferağa, Kadıköy", "city": "İstanbul",
                     "lat": 40.9892, "lng": 29.0265, "distanceMeters": 620},
        "createdAt": _t - 50 * 60000, "expiresAt": _t + 70 * 60000,
        "energyLevel": 2, "resonanceScore": 88, "activeListenersCount": 11, "hasActiveFlashChat": False,
    },
    {
        "id": "sphere-3",
        "user": {"id": "u-3", "name": "Emir Karahan", "handle": "@emir_k", "isAnonymous": False,
                 "avatarUrl": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80"},
        "song": SONGS[2], "moodTags": ["gece", "techno", "bas"],
        "note": "Kulaklık son ses, Akaretler yokuşunu tırmanırken bas ritmi.",
        "location": {"name": "W Lounge & Akaretler", "neighborhood": "Beşiktaş", "city": "İstanbul",
                     "lat": 41.0425, "lng": 29.0042, "distanceMeters": 1450},
        "createdAt": _t - 105 * 60000, "expiresAt": _t + 15 * 60000,
        "energyLevel": 5, "resonanceScore": 91, "activeListenersCount": 18, "hasActiveFlashChat": True,
    },
    {
        "id": "sphere-4",
        "user": {"id": "u-4", "name": "Selin & Melisa", "handle": "@selin_m", "isAnonymous": False,
                 "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80"},
        "song": SONGS[0], "moodTags": ["yağmurlu", "indie", "nostalji"],
        "note": "Karaköy vapurunu beklerken içe dokunan o nakarat...",
        "location": {"name": "Karaköy Şehir Hatları İskelesi", "neighborhood": "Karaköy, Beyoğlu", "city": "İstanbul",
                     "lat": 41.0232, "lng": 28.9785, "distanceMeters": 2100},
        "createdAt": _t - 15 * 60000, "expiresAt": _t + 105 * 60000,
        "energyLevel": 4, "resonanceScore": 99, "activeListenersCount": 24, "hasActiveFlashChat": True,
    },
    {
        "id": "sphere-5",
        "user": {"id": "u-anon-5", "name": "ODTÜ Frekansı", "handle": "@odtu_vibe", "isAnonymous": True},
        "song": SONGS[4], "moodTags": ["psikedelik", "kampüs", "özgürlük"],
        "note": "Çim amfide güneş batarken amfiden yükselen ses.",
        "location": {"name": "ODTÜ Çim Amfi", "neighborhood": "Üniversiteler Mah.", "city": "Ankara",
                     "lat": 39.8912, "lng": 32.7845, "distanceMeters": 450000},
        "createdAt": _t - 40 * 60000, "expiresAt": _t + 80 * 60000,
        "energyLevel": 4, "resonanceScore": 84, "activeListenersCount": 9, "hasActiveFlashChat": False,
    },
]

for s in SEED_SPHERES:
    SPHERES_DB[s["id"]] = s


# ---------- Schemas ----------

class DropSphereRequest(BaseModel):
    songId: str
    moodTags: list[str]
    note: str = ""
    locationName: str
    neighborhood: str
    city: str
    lat: float
    lng: float
    energyLevel: int = 3


# ---------- Endpoints ----------

@app.get("/api/health")
def health():
    return {"status": "ok", "spheres": len(SPHERES_DB)}


@app.get("/api/spheres")
def list_spheres():
    now = now_ms()
    active = [s for s in SPHERES_DB.values() if s["expiresAt"] > now]
    return {"spheres": active, "count": len(active)}


@app.get("/api/spheres/{sphere_id}")
def get_sphere(sphere_id: str):
    s = SPHERES_DB.get(sphere_id)
    if not s or s["expiresAt"] <= now_ms():
        raise HTTPException(404, "Sphere bulunamadı veya süresi dolmuş")
    return s


@app.post("/api/spheres")
def create_sphere(req: DropSphereRequest):
    song = next((s for s in SONGS if s["id"] == req.songId), None)
    if not song:
        raise HTTPException(400, "Geçersiz şarkı ID")

    user = USERS_DB["usr-self"]
    sphere_id = f"sphere-{uuid.uuid4().hex[:8]}"
    now = now_ms()

    sphere = {
        "id": sphere_id,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "handle": user["handle"],
            "isAnonymous": False,
        },
        "song": song,
        "moodTags": req.moodTags[:3],
        "note": req.note,
        "location": {
            "name": req.locationName,
            "neighborhood": req.neighborhood,
            "city": req.city,
            "lat": req.lat,
            "lng": req.lng,
            "distanceMeters": 0,
        },
        "createdAt": now,
        "expiresAt": now + 2 * HOUR,
        "energyLevel": req.energyLevel,
        "resonanceScore": None,
        "activeListenersCount": 1,
        "hasActiveFlashChat": False,
    }
    SPHERES_DB[sphere_id] = sphere
    return sphere


@app.delete("/api/spheres/{sphere_id}")
def delete_sphere(sphere_id: str):
    if sphere_id not in SPHERES_DB:
        raise HTTPException(404, "Sphere bulunamadı")
    del SPHERES_DB[sphere_id]
    return {"deleted": sphere_id}


@app.get("/api/user/me")
def get_current_user():
    user = USERS_DB["usr-self"]
    user["currentSong"] = SONGS[0]
    return user


@app.get("/api/songs")
def list_songs():
    return {"songs": SONGS}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)
