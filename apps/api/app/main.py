from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import applications, auth, copilot, labeling, opportunities, profile

app = FastAPI(title="VioletFund API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"http://(localhost|127\\.0\\.0\\.1):\\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(opportunities.router)
app.include_router(applications.router)
app.include_router(labeling.router)
app.include_router(copilot.router)


@app.get("/")
def root():
    return {"status": "ok"}
