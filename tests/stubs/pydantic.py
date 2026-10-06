class _Req: pass
REQUIRED = _Req()
def Field(default=REQUIRED, **kw): return default
class BaseModel:
    def __init__(self, **kw):
        for k in getattr(self.__class__, '__annotations__', {}):
            d = getattr(self.__class__, k, REQUIRED)
            if k in kw: setattr(self, k, kw[k])
            elif d is REQUIRED: raise ValueError(f'missing {k}')
            else: setattr(self, k, d)
