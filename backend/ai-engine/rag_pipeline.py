import os
import chromadb
import re
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer


print("Ładowanie darmowego modelu embeddingów...")
model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="./chroma_db")
COLLECTION_NAME = "labgeneral_docs"


def split_text_into_chunks(text: str):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2500,
        chunk_overlap=300,
        separators=["\n## ", "\n### ", "\n\n", "\n", " "]
    )
    return text_splitter.split_text(text)


def create_documents_with_metadata(chunks: list[str], base_url: str):
    documents = []
    for idx, chunk in enumerate(chunks):
        lines = chunk.strip().split("\n")
        section_title = "Główna"
        for line in lines:
            if line.startswith("#"):
                section_title = line.replace("#", "").strip()
                break

        doc_data = {
            "title": "LABgeneral - Oferta",
            "url": base_url,
            "section": section_title,
            "content": chunk,
            "chunk_id": f"chunk_{idx}"
        }
        documents.append(doc_data)
    return documents


def index_documents(documents: list[dict]):
    try:
        chroma_client.delete_collection(name=COLLECTION_NAME)
        print("[-] Usunięto starą indeksację.")
    except Exception:
        pass

    collection = chroma_client.create_collection(name=COLLECTION_NAME)
    print(f"[+] Indeksowanie {len(documents)} fragmentów...")

    for doc in documents:
        embedding_vector = model.encode(doc["content"]).tolist()

        collection.add(
            ids=[doc["chunk_id"]],
            embeddings=[embedding_vector],
            documents=[doc["content"]],
            metadatas=[{
                "title": doc["title"],
                "url": doc["url"],
                "section": doc["section"]
            }]
        )

    print("[✓] Pomyślnie zindeksowano fragmenty w bazie ChromaDB!")


def query_vector_db(query_text: str, top_k: int = 2):
    print(f"\nSzukanie odpowiedzi na: '{query_text}'...")

    query_vector = model.encode(query_text).tolist()

    collection = chroma_client.get_collection(name=COLLECTION_NAME)
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )

    print("\n================ ZNALAZIONA TREŚĆ ================")
    for i in range(len(results["ids"][0])):
        meta = results["metadatas"][0][i]
        doc_content = results["documents"][0][i]
        print(f"\n[Wynik {i+1}] Sekcja: {meta['section']} | URL: {meta['url']}")
        print(f"Treść:\n{doc_content[:300]}...")
        print("-" * 50)


if __name__ == "__main__":
    if not os.path.exists("oczyszczony_tekst.txt"):
        print("[!] Błąd: Brak pliku 'oczyszczony_tekst.txt'")
        exit()

    with open("oczyszczony_tekst.txt", "r", encoding="utf-8") as f:
        raw_text = f.read()

    chunks = split_text_into_chunks(raw_text)
    docs_with_metadata = create_documents_with_metadata(chunks, base_url="https://labgeneral.pl")
    index_documents(docs_with_metadata)

    # Test wyszukiwania
    query_vector_db("Czym sie zajmuje LABgeneral?")
    
collection = chroma_client.get_collection(name=COLLECTION_NAME)
print(f"Liczba zapisanych fragmentów w bazie: {collection.count()}")

