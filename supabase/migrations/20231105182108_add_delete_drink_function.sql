set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_drink_data(drinkid bigint)
 RETURNS void
 LANGUAGE sql
AS $function$delete from public.drink_counters where drink_id = drinkid;
delete from public.drinks where id = drinkid;
$function$
;


