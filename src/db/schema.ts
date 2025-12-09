import { pgTable, serial, text, timestamp, boolean, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["driver", "mechanic", "workshop_owner", "admin"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "accepted", "in_progress", "completed", "cancelled"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled"]);
export const serviceTypeEnum = pgEnum("service_type", ["tow", "battery", "tire", "fuel", "mechanic", "maintenance", "other"]);

// Subscription enums
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "inactive", "past_due"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  stackId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("driver").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  pushSubscription: text("push_subscription"), // JSON string with Web Push subscription
  // Subscription fields
  plan: planEnum("plan").default("free").notNull(),
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default("inactive").notNull(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vehicles Table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  plate: text("plate").notNull(),
  vin: text("vin"),
  color: text("color"),
  mileage: integer("mileage"), // Kilometraje actual
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Workshops Table
export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  phone: text("phone"),
  imageUrl: text("image_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Services Table (Catalog of services offered by workshops)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").references(() => workshops.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // In Bolivianos
  durationMinutes: integer("duration_minutes").default(60),
  type: serviceTypeEnum("type").default("maintenance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assistance Requests Table (Uber-like)
export const assistanceRequests = pgTable("assistance_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  providerId: integer("provider_id").references(() => users.id), // Mechanic/Tow driver
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  type: serviceTypeEnum("type").notNull(),
  description: text("description"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
  status: requestStatusEnum("status").default("pending").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Appointments Table (Workshop bookings)
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workshopId: integer("workshop_id").references(() => workshops.id).notNull(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  date: timestamp("date").notNull(),
  status: appointmentStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workshopId: integer("workshop_id").references(() => workshops.id),
  providerId: integer("provider_id").references(() => users.id), // For roadside assistance
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products Table (Workshop Inventory)
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  workshopId: integer("workshop_id").references(() => workshops.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0).notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat Sessions
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => chatSessions.id).notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Payment Methods (métodos de pago guardados)
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  cardholderName: text("cardholder_name").notNull(),
  cardNumber: text("card_number").notNull(),
  expiryMonth: integer("expiry_month").notNull(),
  expiryYear: integer("expiry_year").notNull(),
  cardType: text("card_type").notNull(),
  isDefault: boolean("is_default").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vehicle Service History (historial de servicios realizados al vehículo)
export const vehicleServiceHistory = pgTable("vehicle_service_history", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id).notNull(),
  assistanceRequestId: integer("assistance_request_id").references(() => assistanceRequests.id),
  serviceType: text("service_type").notNull(), // tow, battery, tire, fuel, mechanic, oil_change, etc.
  description: text("description"),
  mileageAtService: integer("mileage_at_service"), // Kilometraje al momento del servicio
  cost: decimal("cost", { precision: 10, scale: 2 }),
  serviceDate: timestamp("service_date").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  workshops: many(workshops),
  assistanceRequests: many(assistanceRequests, { relationName: "userRequests" }),
  providedAssistance: many(assistanceRequests, { relationName: "providerRequests" }),
  appointments: many(appointments),
  reviews: many(reviews),
  chatSessions: many(chatSessions),
  paymentMethods: many(paymentMethods),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, {
    fields: [paymentMethods.userId],
    references: [users.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  assistanceRequests: many(assistanceRequests),
  appointments: many(appointments),
  serviceHistory: many(vehicleServiceHistory),
}));

export const vehicleServiceHistoryRelations = relations(vehicleServiceHistory, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleServiceHistory.vehicleId],
    references: [vehicles.id],
  }),
  assistanceRequest: one(assistanceRequests, {
    fields: [vehicleServiceHistory.assistanceRequestId],
    references: [assistanceRequests.id],
  }),
}));

export const workshopsRelations = relations(workshops, ({ one, many }) => ({
  owner: one(users, {
    fields: [workshops.ownerId],
    references: [users.id],
  }),
  services: many(services),
  appointments: many(appointments),
  reviews: many(reviews),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  workshop: one(workshops, {
    fields: [services.workshopId],
    references: [workshops.id],
  }),
  appointments: many(appointments),
}));

export const assistanceRequestsRelations = relations(assistanceRequests, ({ one }) => ({
  user: one(users, {
    fields: [assistanceRequests.userId],
    references: [users.id],
    relationName: "userRequests",
  }),
  provider: one(users, {
    fields: [assistanceRequests.providerId],
    references: [users.id],
    relationName: "providerRequests",
  }),
  vehicle: one(vehicles, {
    fields: [assistanceRequests.vehicleId],
    references: [vehicles.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  workshop: one(workshops, {
    fields: [appointments.workshopId],
    references: [workshops.id],
  }),
  vehicle: one(vehicles, {
    fields: [appointments.vehicleId],
    references: [vehicles.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  workshop: one(workshops, {
    fields: [reviews.workshopId],
    references: [workshops.id],
  }),
  provider: one(users, {
    fields: [reviews.providerId],
    references: [users.id],
  }),
}));
