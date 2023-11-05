set check_function_bodies = off;

DROP FUNCTION public.decrement;
CREATE OR REPLACE FUNCTION public.decrement(row_id bigint)
 RETURNS integer
 LANGUAGE sql
AS $function$update drink_counters
set "count" = "count" - 1
where id = row_id and "count" > 0;
select "count" from drink_counters where id = row_id;$function$
;

DROP FUNCTION public.increment;
CREATE OR REPLACE FUNCTION public.increment(row_id bigint)
 RETURNS integer
 LANGUAGE sql
AS $function$update drink_counters
set "count" = "count" + 1
where id = row_id;
select "count" from drink_counters where id = row_id;$function$
;


