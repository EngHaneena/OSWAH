"""مكونات مشتركة بين المسارين: الإعدادات، عميل OpenAI، والتحقق من مفتاح Next.js."""
from dotenv import load_dotenv

load_dotenv()  # يسبق قراءة الإعدادات

from typing import Optional

from fastapi import Header, HTTPException
from openai import OpenAI

from core import Settings

settings = Settings()
_openai: Optional[OpenAI] = None


def openai_client() -> OpenAI:
    global _openai
    if _openai is None:
        _openai = OpenAI()  # يقرأ OPENAI_API_KEY من البيئة؛ المفاتيح في الخلفية فقط
    return _openai


def require_key(x_oswah_key: Optional[str] = Header(default=None)):
    """إن ضُبط BACKEND_SHARED_SECRET فلا يقبل السيرفر إلا طلبات Next.js التي تحمل المفتاح."""
    if settings.shared_secret and x_oswah_key != settings.shared_secret:
        raise HTTPException(status_code=401, detail="unauthorized")
