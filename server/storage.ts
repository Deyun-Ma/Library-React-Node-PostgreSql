import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  books, type Book, type InsertBook,
  bookBorrowings, type Borrowing, type InsertBorrowing,
  borrowingStatusEnum
} from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull, sql, desc, like } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Book operations
  getBooks(filters?: { 
    categoryId?: number; 
    available?: boolean;
    search?: string;
    format?: string;
  }): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, book: Partial<InsertBook>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  
  // Borrowing operations
  borrowBook(borrowing: InsertBorrowing): Promise<Borrowing>;
  returnBook(id: number): Promise<Borrowing | undefined>;
  getUserBorrowings(userId: number): Promise<Borrowing[]>;
  getBookBorrowings(bookId: number): Promise<Borrowing[]>;
  getAllBorrowings(): Promise<Borrowing[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  // Book operations
  async getBooks(filters?: { 
    categoryId?: number; 
    available?: boolean;
    search?: string;
    format?: string;
  }): Promise<Book[]> {
    let query = db.select().from(books);
    
    if (filters) {
      if (filters.categoryId) {
        query = query.where(eq(books.categoryId, filters.categoryId));
      }
      
      if (filters.available) {
        query = query.where(sql`${books.availableCopies} > 0`);
      }
      
      if (filters.search) {
        query = query.where(
          sql`${books.title} ILIKE ${'%' + filters.search + '%'} OR ${books.author} ILIKE ${'%' + filters.search + '%'}`
        );
      }
      
      if (filters.format) {
        query = query.where(eq(books.format, filters.format));
      }
    }
    
    return query;
  }
  
  async getBookById(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }
  
  async createBook(book: InsertBook): Promise<Book> {
    // Set available copies equal to total copies on creation
    const bookWithAvailable = {
      ...book,
      availableCopies: book.totalCopies
    };
    
    const [newBook] = await db
      .insert(books)
      .values(bookWithAvailable)
      .returning();
    return newBook;
  }
  
  async updateBook(id: number, bookUpdate: Partial<InsertBook>): Promise<Book | undefined> {
    const [updatedBook] = await db
      .update(books)
      .set(bookUpdate)
      .where(eq(books.id, id))
      .returning();
    return updatedBook;
  }
  
  async deleteBook(id: number): Promise<boolean> {
    const deleted = await db
      .delete(books)
      .where(eq(books.id, id));
    return true;
  }
  
  // Borrowing operations
  async borrowBook(borrowing: InsertBorrowing): Promise<Borrowing> {
    // Start a transaction
    return db.transaction(async (tx) => {
      // Get the book
      const [book] = await tx
        .select()
        .from(books)
        .where(eq(books.id, borrowing.bookId));
      
      if (!book || book.availableCopies < 1) {
        throw new Error("Book not available for borrowing");
      }
      
      // Update book available copies
      await tx
        .update(books)
        .set({ availableCopies: book.availableCopies - 1 })
        .where(eq(books.id, borrowing.bookId));
      
      // Create borrowing record
      const [newBorrowing] = await tx
        .insert(bookBorrowings)
        .values(borrowing)
        .returning();
      
      return newBorrowing;
    });
  }
  
  async returnBook(id: number): Promise<Borrowing | undefined> {
    // Start a transaction
    return db.transaction(async (tx) => {
      // Get the borrowing record
      const [borrowing] = await tx
        .select()
        .from(bookBorrowings)
        .where(and(
          eq(bookBorrowings.id, id),
          eq(bookBorrowings.status, 'borrowed')
        ));
      
      if (!borrowing) {
        throw new Error("Borrowing record not found or already returned");
      }
      
      // Get the book
      const [book] = await tx
        .select()
        .from(books)
        .where(eq(books.id, borrowing.bookId));
      
      if (!book) {
        throw new Error("Book not found");
      }
      
      // Update book available copies
      await tx
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, borrowing.bookId));
      
      // Update borrowing record
      const [updatedBorrowing] = await tx
        .update(bookBorrowings)
        .set({ 
          returnDate: new Date(),
          status: 'returned'
        })
        .where(eq(bookBorrowings.id, id))
        .returning();
      
      return updatedBorrowing;
    });
  }
  
  async getUserBorrowings(userId: number): Promise<Borrowing[]> {
    return db
      .select()
      .from(bookBorrowings)
      .where(eq(bookBorrowings.userId, userId))
      .orderBy(desc(bookBorrowings.borrowDate));
  }
  
  async getBookBorrowings(bookId: number): Promise<Borrowing[]> {
    return db
      .select()
      .from(bookBorrowings)
      .where(eq(bookBorrowings.bookId, bookId))
      .orderBy(desc(bookBorrowings.borrowDate));
  }
  
  async getAllBorrowings(): Promise<Borrowing[]> {
    return db
      .select()
      .from(bookBorrowings)
      .orderBy(desc(bookBorrowings.borrowDate));
  }
}

export const storage = new DatabaseStorage();
