"""
Pydantic Models for Marrakech Craft Conduit Lead Discovery & Outreach Engine.
"""

from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, HttpUrl, field_validator

class BoutiqueLead(BaseModel):
    id: str
    name: str = Field(..., min_length=2, description="Trade name of the boutique/store")
    city: str = Field(..., description="City location, e.g. Paris, Madrid, Milan")
    country: str = Field(default="FR", max_length=10, description="ISO country code")
    website: Optional[str] = Field(default=None, description="Official boutique website URL")
    domain: Optional[str] = Field(default=None, description="Clean hostname domain for deduplication")
    email: Optional[str] = Field(default=None, description="Verified decision-maker email")
    phone: Optional[str] = Field(default=None, description="Direct contact or WhatsApp phone")
    instagram: Optional[str] = Field(default=None, description="Instagram handle or URL")
    rating: Optional[float] = Field(default=4.8, ge=0.0, le=5.0, description="Google Places rating")
    user_ratings_total: Optional[int] = Field(default=0, ge=0)
    address: Optional[str] = Field(default=None)
    niche: Optional[str] = Field(default="concept_store")
    style_tags: List[str] = Field(default_factory=list, description="Aesthetic & craft keywords")
    status: Literal["discovered", "matched", "pitched", "replied", "skipped_duplicate"] = "discovered"
    qualification: Optional[Dict[str, Any]] = Field(default=None, description="Multi-agent catalog & logistics payload")
    lookbook_pdf_url: Optional[str] = Field(default=None, description="Generated Lookbook PDF/HTML path or URL")
    created_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = Field(default_factory=lambda: datetime.utcnow().isoformat())

    @field_validator("domain", mode="before")
    def compute_domain(cls, v, values):
        if v:
            return v.lower().replace("http://", "").replace("https://", "").split("/")[0]
        return v

class DiscoveryJob(BaseModel):
    job_id: str
    cities: List[str] = Field(default_factory=lambda: ["Paris"])
    niches: List[str] = Field(default_factory=lambda: ["concept_store", "boho_decor"])
    status: Literal["queued", "running", "completed", "failed"] = "queued"
    leads_count: int = 0
    duration_seconds: Optional[float] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    completed_at: Optional[str] = None
    leads: List[BoutiqueLead] = Field(default_factory=list)

class LookbookPayload(BaseModel):
    store_name: str
    city: str
    country: str
    craft_title: str
    craft_description: str
    sample_price_usd: float
    boutique_price_usd: float
    wholesale_price_usd: float
    incoterm: str = "DAP"
    transit_time: str = "3-5 days"

class OutreachRequest(BaseModel):
    lead_id: str
    recipient_email: str
    subject: str
    body_html: str
    lookbook_url: Optional[str] = None
    dry_run: bool = True
