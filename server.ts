import express from "express";
import cors from "cors";
import { CosmosClient } from "@azure/cosmos";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
let db;
let container;

async function ensureDbSetup() {
  const { database } = await client.databases.createIfNotExists({
    id: process.env.COSMOS_DB_NAME,
  });
  db = database;
  const { container: cont } = await db.containers.createIfNotExists({
    id: process.env.COSMOS_CONTAINER,
    partitionKey: { kind: "Hash", paths: ["/userId"] },
  });
  container = cont;
}

ensureDbSetup();

// Save calculation/project
app.post("/api/save", async (req, res) => {
  try {
    const { resource } = await container.items.create(req.body);
    res.json(resource);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

// Get all calculations/projects
app.get("/api/all", async (_req, res) => {
  try {
    const { resources } = await container.items.readAll().fetchAll();
    res.json(resources);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on port ${port}`));
