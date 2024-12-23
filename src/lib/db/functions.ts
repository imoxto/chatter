import { cosineDistance, desc, gt, sql } from "drizzle-orm";

import { embeddings } from "./schema/embeddings";
import { generateEmbedding, generateEmbeddings } from "../ai/embeddings";
import { db } from "./drizzle";
import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "./schema/resources";

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.3))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
};

export const createResource = async (input: NewResourceParams) => {
  const { content } = insertResourceSchema.parse(input);

  const [resource] = await db.insert(resources).values({ content }).returning();

  const generatedEmbeddings = await generateEmbeddings(content);
  await db.insert(embeddings).values(
    generatedEmbeddings.map((embedding) => ({
      resourceId: resource.id,
      ...embedding,
    }))
  );
  return "Resource successfully created and embedded.";
};
