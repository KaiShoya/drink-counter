drop function if exists "public"."get_user_settings"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_settings()
 RETURNS TABLE (threshold_for_detecting_overdrinking smallint)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$select
  threshold_for_detecting_overdrinking
from
  user_settings
where
  user_id = auth.uid();
$function$
;


