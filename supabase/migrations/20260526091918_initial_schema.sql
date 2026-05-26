-- Initial schema for leet-cards.
-- Captured from the production Supabase project (ref hcsuyxvhldazxdmpmjjj, Postgres 17.6)
-- prior to migrating to local development. Column order matches the deployed table
-- (description/example/stumbles/completion_count were added later via ALTER TABLE,
-- so they sit after created_at/last_reviewed).

CREATE TABLE IF NOT EXISTS "public"."cards" (
    "id" integer NOT NULL,
    "num" integer NOT NULL,
    "title" character varying(255) NOT NULL,
    "difficulty" character varying(10) DEFAULT 'medium'::character varying,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "key_points" "jsonb" DEFAULT '[]'::"jsonb",
    "complexity" character varying(255) DEFAULT ''::character varying,
    "follow_ups" "jsonb" DEFAULT '[]'::"jsonb",
    "gotchas" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_reviewed" timestamp with time zone,
    "description" "text" DEFAULT ''::"text",
    "example" "text" DEFAULT ''::"text",
    "stumbles" "jsonb" DEFAULT '[]'::"jsonb",
    "completion_count" integer DEFAULT 0 NOT NULL
);

CREATE SEQUENCE IF NOT EXISTS "public"."cards_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."cards_id_seq" OWNED BY "public"."cards"."id";

ALTER TABLE ONLY "public"."cards" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."cards_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("id");

CREATE INDEX "idx_cards_difficulty" ON "public"."cards" USING "btree" ("difficulty");
CREATE INDEX "idx_cards_num" ON "public"."cards" USING "btree" ("num");

ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON "public"."cards" USING (true) WITH CHECK (true);

-- Grant the PostgREST roles access to the table (matches the deployed project so the
-- anon/publishable key works locally; RLS still applies on top of these grants).
GRANT USAGE ON SCHEMA "public" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."cards" TO "anon", "authenticated", "service_role";
GRANT ALL ON SEQUENCE "public"."cards_id_seq" TO "anon", "authenticated", "service_role";
