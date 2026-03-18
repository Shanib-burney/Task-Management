import express from "express";
import type { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "./db/prisma-client.js";
import userRoutes from "./modules/user/user.routes.js";
import teamRoutes from "./modules/team/team.routes.js";
import projectRoutes from "./modules/project/project.routes.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});

// // User CRUD
// app.get("/users", async (req: Request, res: Response) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// app.get("/users/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

//   const user = await prisma.user.findUnique({ where: { id } });
//   if (!user) return res.status(404).json({ error: "User not found" });
//   res.json(user);
// });

// app.post("/users", async (req: Request, res: Response) => {
//   const { name, email, role, status, passwordHash } = req.body;
//   if (!name || !email || role === undefined || status === undefined || !passwordHash) {
//     return res
//       .status(400)
//       .json({ error: "name, email, role, status, and passwordHash are required" });
//   }

//   try {
//     const user = await prisma.user.create({
//       data: { name, email, role: Number(role), status: Number(status), passwordHash },
//     });
//     res.status(201).json(user);
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     if (message.includes("Unique constraint failed")) {
//       return res.status(409).json({ error: "Email already exists" });
//     }
//     res.status(500).json({ error: message });
//   }
// });

// app.put("/users/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

//   const { name, email, role, status, passwordHash } = req.body;
//   try {
//     const user = await prisma.user.update({
//       where: { id },
//       data: {
//         name,
//         email,
//         role: role !== undefined ? Number(role) : undefined,
//         status: status !== undefined ? Number(status) : undefined,
//         passwordHash,
//       },
//     });
//     res.json(user);
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     if (message.includes("Record to update not found")) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(500).json({ error: message });
//   }
// });

// app.delete("/users/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });

//   try {
//     await prisma.user.delete({ where: { id } });
//     res.status(204).send();
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     if (message.includes("Record to delete does not exist")) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.status(500).json({ error: message });
//   }
// });

// // Team CRUD
// app.get("/teams", async (req: Request, res: Response) => {
//   const teams = await prisma.team.findMany();
//   res.json(teams);
// });

// app.get("/teams/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid team ID" });

//   const team = await prisma.team.findUnique({ where: { id } });
//   if (!team) return res.status(404).json({ error: "Team not found" });
//   res.json(team);
// });

// app.post("/teams", async (req: Request, res: Response) => {
//   const { name, status } = req.body;
//   if (!name || status === undefined) {
//     return res.status(400).json({ error: "name and status are required" });
//   }

//   const team = await prisma.team.create({
//     data: { name, status: Number(status) },
//   });
//   res.status(201).json(team);
// });

// app.put("/teams/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid team ID" });

//   const { name, status } = req.body;
//   try {
//     const team = await prisma.team.update({
//       where: { id },
//       data: { name, status: status !== undefined ? Number(status) : undefined },
//     });
//     res.json(team);
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     if (message.includes("Record to update not found")) {
//       return res.status(404).json({ error: "Team not found" });
//     }
//     res.status(500).json({ error: message });
//   }
// });

// app.delete("/teams/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid team ID" });

//   try {
//     await prisma.team.delete({ where: { id } });
//     res.status(204).send();
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     if (message.includes("Record to delete does not exist")) {
//       return res.status(404).json({ error: "Team not found" });
//     }
//     res.status(500).json({ error: message });
//   }
// });

    // "dev": "nodemon --exec tsx src/index.ts"
