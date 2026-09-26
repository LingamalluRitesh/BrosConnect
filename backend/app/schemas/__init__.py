from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# --- Skill & Technology Schemas ---
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None

class SkillOut(SkillBase):
    id: int
    class Config:
        from_attributes = True

class TechnologyBase(BaseModel):
    name: str

class TechnologyOut(TechnologyBase):
    id: int
    class Config:
        from_attributes = True

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None

class RegisterDeveloperRequest(UserBase):
    password: str = Field(..., min_length=6)
    title: str = "Full-Stack Developer"
    short_bio: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: List[str] = []
    years_experience: int = 1
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    availability: str = "Available for Projects"

class RegisterClientRequest(UserBase):
    password: str = Field(..., min_length=6)
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None

class RegisterAdminRequest(UserBase):
    password: str = Field(..., min_length=6)
    role: str = "super_admin"
    title: Optional[str] = "Chief Executive Officer"
    admin_key: Optional[str] = None

class LoginRequest(BaseModel):
    email_or_username: str
    password: str

class UserBrief(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    is_verified: bool
    class Config:
        from_attributes = True

class DeveloperProfileBrief(BaseModel):
    id: int
    title: Optional[str] = None
    location: Optional[str] = None
    availability: Optional[str] = "Available for Projects"
    years_experience: Optional[int] = 1
    user: UserBrief
    skills: List[SkillOut] = []
    class Config:
        from_attributes = True

class DeveloperProfileOut(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    short_bio: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    availability: Optional[str] = "Available for Projects"
    years_experience: Optional[int] = 1
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    is_public: bool = True
    views_count: int = 0
    user: UserBrief
    skills: List[SkillOut] = []
    class Config:
        from_attributes = True

class DeveloperProfileUpdate(BaseModel):
    title: Optional[str] = None
    short_bio: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    availability: Optional[str] = None
    years_experience: Optional[int] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    is_public: Optional[bool] = None
    skills: Optional[List[str]] = None
    avatar_url: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None

class AdminUserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    title: Optional[str] = None
    short_bio: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    availability: Optional[str] = None
    years_experience: Optional[int] = None
    skills: Optional[List[str]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None

class ClientProfileOut(BaseModel):
    id: int
    user_id: int
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    class Config:
        from_attributes = True

class AdminUserOut(UserBase):
    id: int
    role: str
    status: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime
    developer_profile: Optional[DeveloperProfileOut] = None
    client_profile: Optional[ClientProfileOut] = None
    projects_count: int = 0
    class Config:
        from_attributes = True

class UserOut(UserBase):
    id: int
    role: str
    status: str
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime
    developer_profile: Optional[DeveloperProfileOut] = None
    client_profile: Optional[ClientProfileOut] = None
    class Config:
        from_attributes = True

# --- Project Attribution & Schemas ---
class ProjectDeveloperOut(BaseModel):
    id: int
    role_in_project: str
    is_lead: bool
    developer: DeveloperProfileBrief
    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: int
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = "Websites"
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = "Published"
    client_name: Optional[str] = None
    start_date: Optional[str] = None
    completion_date: Optional[str] = None
    created_at: Optional[datetime] = None
    developer_associations: List[ProjectDeveloperOut] = []
    technologies: List[TechnologyOut] = []
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    name: str
    short_description: Optional[str] = None
    description: Optional[str] = None
    category: str = "Software"
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    image_url: Optional[str] = None
    client_name: Optional[str] = None
    start_date: Optional[str] = None
    completion_date: Optional[str] = None
    technologies: List[str] = []
    team_members: Optional[List[dict]] = None # [{"developer_id": int, "role_in_project": str, "is_lead": bool}]

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    client_name: Optional[str] = None
    technologies: Optional[List[str]] = None

# --- Client Inquiry Schemas ---
class ClientInquiryCreate(BaseModel):
    developer_id: int
    project_name: str
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    description: str

class ClientInquiryUpdate(BaseModel):
    status: str # New, Contacted, In Discussion, Proposal, In Progress, Completed, Closed

class ClientInquiryOut(BaseModel):
    id: int
    client_id: int
    developer_id: int
    project_name: str
    project_type: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    description: str
    status: str
    created_at: datetime
    client: UserBrief
    developer: DeveloperProfileBrief
    class Config:
        from_attributes = True

# --- Community Schemas ---
class CommunityChannelOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_locked: bool
    created_at: datetime
    class Config:
        from_attributes = True

class CommunityMessageCreate(BaseModel):
    content: str

class CommunityMessageOut(BaseModel):
    id: int
    channel_id: int
    user_id: int
    content: str
    created_at: datetime
    user: UserBrief
    class Config:
        from_attributes = True

# --- Direct Chat Schemas ---
class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    is_read: bool
    created_at: datetime
    sender: UserBrief
    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: int
    inquiry_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    members: List[dict] = []
    last_message: Optional[MessageOut] = None
    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- Admin & Stats Schemas ---
class DashboardStatsOut(BaseModel):
    total_developers: int
    verified_developers: int
    pending_applications: int
    total_projects: int
    total_clients: int
    total_inquiries: int
    active_channels: int

class DeveloperApprovalRequest(BaseModel):
    action: str # approve, reject, suspend
    reason: Optional[str] = None
