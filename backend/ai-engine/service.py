from fastapi import FastAPI
from pydantic import BaseModel
import chromadb
from sentence_transformers import SentenceTransformer
import time

app = FastAPI(title="LABgeneral RAG Service")

model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.PersistentClient(path="./chroma_db")
COLLECTION_NAME = "labgeneral_docs"


class SearchRequest(BaseModel):
    query: str
    top_k: int = 4


class Chunk(BaseModel):
    content: str
    title: str
    url: str
    section: str


@app.post("/retrieve", response_model=list[Chunk])
def retrieve(request: SearchRequest):
    start = time.time()

    print("=== RETRIEVE START ===")

    collection = chroma_client.get_collection(name=COLLECTION_NAME)
    print(f"collection: {time.time() - start:.2f}s")

    query_vector = model.encode(request.query).tolist()
    print(f"embedding: {time.time() - start:.2f}s")

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=request.top_k
    )
    print(f"chroma: {time.time() - start:.2f}s")

    chunks = []

    for i in range(len(results["ids"][0])):
        meta = results["metadatas"][0][i]

        chunks.append(Chunk(
            content=results["documents"][0][i],
            title=meta["title"],
            url=meta["url"],
            section=meta["section"]
        ))

    print(f"=== RETRIEVE END: {time.time() - start:.2f}s ===")

    return chunks


@app.get("/health")
def health():
    return {"status": "ok"}