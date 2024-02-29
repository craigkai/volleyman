set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_match_state()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
    -- Check if the state is different
    IF (SELECT state FROM matches WHERE id = NEW.id) IS DISTINCT FROM
       (SELECT
         CASE
           WHEN (SELECT team1_score FROM matches WHERE id = NEW.id) IS NOT NULL AND (SELECT team2_score FROM matches WHERE id = NEW.id) IS NOT NULL THEN 'COMPLETE'
           ELSE 'INCOMPLETE'
         END)
    THEN
      -- Update the state
      BEGIN
        UPDATE matches
                SET state = CASE WHEN NEW.state = 'COMPLETE' THEN 'INCOMPLETE' ELSE 'COMPLETE' END
        WHERE id = NEW.id;
      END;
    END IF;
  RETURN NEW;
END;
$function$
;


