import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { 
  insertCategorySchema, 
  insertBookSchema, 
  insertBorrowingSchema 
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

// Helper function to handle Zod validation
function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(error.errors));
    }
    throw error;
  }
}

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is admin
function isAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Admin registration endpoint
  app.post("/api/admin/register", async (req, res) => {
    try {
      res.setHeader('Content-Type', 'application/json');
      
      // Check for admin registration secret key
      const { adminSecret, ...userData } = req.body;
      
      if (adminSecret !== process.env.ADMIN_SECRET_KEY && adminSecret !== 'admin-secret-dev') {
        return res.status(403).json({ message: "Invalid admin registration key" });
      }
      
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        ...userData,
        password: await hashPassword(userData.password),
        role: 'admin', // Set admin role
      });

      // Exclude password from response
      const userWithoutPassword = { ...user } as any;
      delete userWithoutPassword.password;

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed after registration" });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Admin registration error:", error);
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Unknown error during admin registration" 
      });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res, next) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/categories", isAdmin, async (req, res, next) => {
    try {
      const categoryData = validateBody(insertCategorySchema, req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  });

  // Book routes
  app.get("/api/books", async (req, res, next) => {
    try {
      const { categoryId, available, search, format } = req.query;
      
      const filters = {
        categoryId: categoryId ? Number(categoryId) : undefined,
        available: available === 'true',
        search: search ? String(search) : undefined,
        format: format ? String(format) : undefined
      };
      
      const books = await storage.getBooks(filters);
      res.json(books);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/books/:id", async (req, res, next) => {
    try {
      const bookId = Number(req.params.id);
      const book = await storage.getBookById(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/books", isAdmin, async (req, res, next) => {
    try {
      const bookData = validateBody(insertBookSchema, req.body);
      const book = await storage.createBook(bookData);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/books/:id", isAdmin, async (req, res, next) => {
    try {
      const bookId = Number(req.params.id);
      
      // Partial validation - only validate fields that are present
      const bookUpdate = req.body;
      
      const updatedBook = await storage.updateBook(bookId, bookUpdate);
      
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(updatedBook);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/books/:id", isAdmin, async (req, res, next) => {
    try {
      const bookId = Number(req.params.id);
      await storage.deleteBook(bookId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Borrowing routes
  app.post("/api/borrowings", isAuthenticated, async (req, res, next) => {
    try {
      const borrowingData = validateBody(insertBorrowingSchema, req.body);
      
      // Use the authenticated user's ID
      borrowingData.userId = req.user.id;
      
      const borrowing = await storage.borrowBook(borrowingData);
      res.status(201).json(borrowing);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/borrowings/:id/return", isAuthenticated, async (req, res, next) => {
    try {
      const borrowingId = Number(req.params.id);
      const borrowing = await storage.returnBook(borrowingId);
      
      if (!borrowing) {
        return res.status(404).json({ message: "Borrowing record not found" });
      }
      
      res.json(borrowing);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/borrowings/user", isAuthenticated, async (req, res, next) => {
    try {
      const borrowings = await storage.getUserBorrowings(req.user.id);
      res.json(borrowings);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/borrowings/book/:id", isAdmin, async (req, res, next) => {
    try {
      const bookId = Number(req.params.id);
      const borrowings = await storage.getBookBorrowings(bookId);
      res.json(borrowings);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/borrowings", isAdmin, async (req, res, next) => {
    try {
      const borrowings = await storage.getAllBorrowings();
      res.json(borrowings);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
