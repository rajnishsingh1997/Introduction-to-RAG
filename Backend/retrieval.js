import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI from "openai";
const client = new OpenAI();

async function retrievalFunction(query) {
  let userQuery = "What is workout to follow on mondays, give me the full details?";

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "embedding-collection",
    }
  );

  const retriever = vectorStore.asRetriever({
    k: 4, // number of documents to retrieve
  });
  const results = await retriever._getRelevantDocuments(userQuery);
  const contextFromDocs = results
    .map((doc, idx) => `Chunk ${idx + 1}:\n${doc.pageContent}`)
    .join("\n\n");

  const systemPrompt = `
You are a helpful AI assistant.

You MUST answer the user's question using ONLY the information
provided in the CONTEXT below.

If the answer is not present in the context, respond with:
"I do not have enough information from the provided documents."

CONTEXT:
${contextFromDocs}
`;
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuery },
    ],
  });
  console.log("AI Response:", response.choices[0].message.content);
}
retrievalFunction();
