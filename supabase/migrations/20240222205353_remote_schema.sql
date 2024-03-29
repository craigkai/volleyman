
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE OR REPLACE FUNCTION "public"."update_match_state"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
    -- Check if the state is different
    IF (SELECT state FROM matches WHERE id = NEW.id) IS DISTINCT FROM
       (SELECT
         CASE
           WHEN (SELECT team1_score FROM matches WHERE id = NEW.id) IS NOT NULL AND (SELECT team2_score FROM matches WHERE id = NEW.id) IS NOT NULL THEN 'complete'
           ELSE 'incomplete'
         END)
    THEN
      -- Update the state
      BEGIN
        UPDATE matches
                SET state = CASE WHEN NEW.state = 'complete' THEN 'incomplete' ELSE 'complete' END
        WHERE id = NEW.id;
      END;
    END IF;
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_match_state"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid" NOT NULL,
    "courts" bigint DEFAULT '2'::bigint,
    "pools" bigint,
    "date" timestamp without time zone,
    "scoring" "text",
    "refs" "text" DEFAULT 'provided'::"text"
);

ALTER TABLE "public"."events" OWNER TO "postgres";

ALTER TABLE "public"."events" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."matches" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "team1" bigint,
    "team2" bigint,
    "team1_score" bigint,
    "team2_score" bigint,
    "event_id" bigint NOT NULL,
    "court" bigint DEFAULT '0'::bigint NOT NULL,
    "round" bigint DEFAULT '0'::bigint NOT NULL,
    "ref" bigint,
    "type" "text" DEFAULT 'pool'::"text" NOT NULL,
    "child_id" bigint,
    "state" "text" DEFAULT 'incomplete'::"text"
);

ALTER TABLE "public"."matches" OWNER TO "postgres";

ALTER TABLE "public"."matches" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."matches_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "state" "text" DEFAULT 'active'::"text",
    "event_id" bigint
);

ALTER TABLE "public"."teams" OWNER TO "postgres";

ALTER TABLE "public"."teams" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."teams_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "game_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "team_pkey" PRIMARY KEY ("id");

CREATE OR REPLACE TRIGGER "on_match_update_set_state" AFTER UPDATE ON "public"."matches" FOR EACH ROW EXECUTE FUNCTION "public"."update_match_state"();

ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_owner_fkey" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_ref_fkey" FOREIGN KEY ("ref") REFERENCES "public"."teams"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_team1_fkey" FOREIGN KEY ("team1") REFERENCES "public"."teams"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "matches_team2_fkey" FOREIGN KEY ("team2") REFERENCES "public"."teams"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "public_matches_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."matches"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."matches"
    ADD CONSTRAINT "public_matches_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."matches"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable Edit Based On Owner" ON "public"."events" TO "authenticated" USING (("auth"."uid"() = "owner"));

CREATE POLICY "Enable edit for event owner" ON "public"."teams" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "events"."owner"
   FROM "public"."events"
  WHERE ("events"."id" = "teams"."event_id")))) WITH CHECK (true);

CREATE POLICY "Enable edit for event owner only" ON "public"."matches" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "events"."owner"
   FROM "public"."events"
  WHERE ("events"."id" = "matches"."event_id")))) WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "public"."events" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."matches" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."teams" FOR SELECT USING (true);

ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."matches" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."teams" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."update_match_state"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_match_state"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_match_state"() TO "service_role";

GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";

GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."matches" TO "anon";
GRANT ALL ON TABLE "public"."matches" TO "authenticated";
GRANT ALL ON TABLE "public"."matches" TO "service_role";

GRANT ALL ON SEQUENCE "public"."matches_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."matches_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."matches_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";

GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."teams_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
