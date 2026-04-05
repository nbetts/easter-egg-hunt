CREATE TABLE "eggs" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"hint1" text,
	"hint2" text,
	"hint3" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
