CREATE TABLE "vehicle_service_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"vehicle_id" integer NOT NULL,
	"assistance_request_id" integer,
	"service_type" text NOT NULL,
	"description" text,
	"mileage_at_service" integer,
	"cost" numeric(10, 2),
	"service_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "mileage" integer;--> statement-breakpoint
ALTER TABLE "vehicle_service_history" ADD CONSTRAINT "vehicle_service_history_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_service_history" ADD CONSTRAINT "vehicle_service_history_assistance_request_id_assistance_requests_id_fk" FOREIGN KEY ("assistance_request_id") REFERENCES "public"."assistance_requests"("id") ON DELETE no action ON UPDATE no action;