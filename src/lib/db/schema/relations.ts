import { relations } from "drizzle-orm";
import { resources } from "./resources";
import { embeddings } from "./embeddings";

export const embeddingsRelations = relations(embeddings, ({ one }) => ({
  resource: one(resources, {
    fields: [embeddings.resourceId],
    references: [resources.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ many }) => ({
  embeddings: many(embeddings),
}));

