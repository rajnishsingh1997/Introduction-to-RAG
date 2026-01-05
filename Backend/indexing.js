import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

const FileForIndexing = "./Hybrid_Fitness_System_2026_Full.pdf";

async function indexingFunction() {
  // step 1: Load the PDF document
  const loader = new PDFLoader(FileForIndexing);
  const docs = await loader.load();

  // Step 2: Split the loaded documents into smaller chunks.
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 0,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const embeddingCollection = await QdrantVectorStore.fromDocuments(
    splitDocs,
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "embedding-collection",
    }
  );

  //   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  //   url: process.env.QDRANT_URL,
  //   collectionName: "langchainjs-testing",
  // });
}
indexingFunction();
