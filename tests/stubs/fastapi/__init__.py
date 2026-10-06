# بديل مبسّط لـ FastAPI للاختبار دون إنترنت: يكفي لاستدعاء دوال المسارات مباشرة.
class HTTPException(Exception):
    def __init__(self, status_code, detail=None):
        super().__init__(detail); self.status_code = status_code; self.detail = detail
def Header(default=None, **kw): return default
def Depends(fn=None): return fn
class _Routes:
    def __init__(self, *a, **kw): self.routes = {}; self.kw = kw
    def _reg(self, method, path, **kw):
        def deco(fn): self.routes[(method, path)] = fn; return fn
        return deco
    def get(self, path, **kw): return self._reg('GET', path, **kw)
    def post(self, path, **kw): return self._reg('POST', path, **kw)
class FastAPI(_Routes):
    def add_middleware(self, *a, **kw): self.middleware = (a, kw)
    def include_router(self, r): self.routes.update(r.routes)
class APIRouter(_Routes): pass
class Request: pass
