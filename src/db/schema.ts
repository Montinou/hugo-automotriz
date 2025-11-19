import { pgTable, serial, text, timestamp, boolean, integer, pgEnum, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["driver", "mechanic", "workshop_owner", "admin"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "accepted", "in_progress", "completed", "cancelled"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled"]);
export const serviceTypeEnum = pgEnum("service_type", ["tow", "battery", "tire", "fuel", "mechanic", "maintenance", "other"]);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  role: userRoleEnum("role").default("driver").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  vehicles: many(vehicles),
  workshops: many(workshops),
  assistanceRequests: many(assistanceRequests, { relationName: "userRequests" }),
  providedAssistance: many(assistanceRequests, { relationName: "providerRequests" }),
  appointments: many(appointments),
  reviews: many(reviews),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  assistanceRequests: many(assistanceRequests),
  appointments: many(appointments),
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
