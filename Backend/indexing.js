import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
const FileForIndexing = "./Hybrid_Fitness_System_2026_Full.pdf";

async function indexingFunction() {
  const loader = new PDFLoader(FileForIndexing);
  const docs = await loader.load();
  console.log("Documents loaded for indexing:", docs);
}
indexingFunction();