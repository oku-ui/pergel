CREATE TABLE IF NOT EXISTS "hello" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "hello_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
