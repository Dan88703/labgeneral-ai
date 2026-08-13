import time

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