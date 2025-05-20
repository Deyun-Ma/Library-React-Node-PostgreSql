import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User roles enum
export const roleEnum = pgEnum('role', ['user', 'admin']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: roleEnum("role").default('user').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  borrowings: many(bookBorrowings),
}));

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  books: many(books),
}));

// Book schema 
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  isbn: text("isbn").notNull().unique(),
  publishedDate: text("published_date"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  coverImage: text("cover_image"),
  format: text("format"), // hardcover, paperback, ebook, etc.
  rating: integer("rating").default(0),
  ratingCount: integer("rating_count").default(0),
});

export const booksRelations = relations(books, ({ one, many }) => ({
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id]
  }),
  borrowings: many(bookBorrowings),
}));

// Borrowing Status enum
export const borrowingStatusEnum = pgEnum('borrowing_status', ['borrowed', 'returned', 'overdue']);

// Book Borrowing schema
export const bookBorrowings = pgTable("book_borrowings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  borrowDate: timestamp("borrow_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: borrowingStatusEnum("status").notNull().default('borrowed'),
});

export const bookBorrowingsRelations = relations(bookBorrowings, ({ one }) => ({
  user: one(users, {
    fields: [bookBorrowings.userId],
    references: [users.id]
  }),
  book: one(books, {
    fields: [bookBorrowings.bookId],
    references: [books.id]
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  role: true 
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ 
  id: true 
});

export const insertBookSchema = createInsertSchema(books).omit({ 
  id: true,
  rating: true,
  ratingCount: true,
  availableCopies: true
});

export const insertBorrowingSchema = createInsertSchema(bookBorrowings).omit({ 
  id: true,
  borrowDate: true,
  status: true,
  returnDate: true
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export type InsertBorrowing = z.infer<typeof insertBorrowingSchema>;
export type Borrowing = typeof bookBorrowings.$inferSelect;

// Login schema
export type LoginData = Pick<InsertUser, "email" | "password">;
