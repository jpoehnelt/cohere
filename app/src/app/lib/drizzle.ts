import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { pgTable, serial, text } from "drizzle-orm/pg-core";

const queryClient = postgres(
  `postgres://postgres:postgres@${process.env.POSTGRES_SERVICE_SERVICE_HOST ?? "127.0.0.1"}:5432/db`
);

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  author: text("author"),
  quote_text: text("quote_text"),
});

export default drizzle(queryClient);
