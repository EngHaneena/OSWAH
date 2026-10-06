# بديل في الذاكرة لـ ChromaDB بمسافة cosine
import math
_STORES = {}
class Collection:
    def __init__(self, name, metadata): self.name, self.metadata, self.rows = name, dict(metadata or {}), {}
    def add(self, ids, embeddings, documents=None, metadatas=None):
        for i, e in zip(ids, embeddings): self.rows[i] = e
    def count(self): return len(self.rows)
    def query(self, query_embeddings, n_results):
        q = query_embeddings[0]
        def cos(a, b):
            na = math.sqrt(sum(x*x for x in a)) or 1; nb = math.sqrt(sum(x*x for x in b)) or 1
            return sum(x*y for x, y in zip(a, b)) / (na*nb)
        ranked = sorted(((i, 1 - cos(q, e)) for i, e in self.rows.items()), key=lambda t: t[1])[:n_results]
        return {"ids": [[i for i, _ in ranked]], "distances": [[d for _, d in ranked]]}
class PersistentClient:
    def __init__(self, path): self.cols = _STORES.setdefault(path, {})
    def get_or_create_collection(self, name, metadata=None):
        if name not in self.cols: self.cols[name] = Collection(name, metadata)
        return self.cols[name]
    def create_collection(self, name, metadata=None): self.cols[name] = Collection(name, metadata); return self.cols[name]
    def delete_collection(self, name): self.cols.pop(name, None)
