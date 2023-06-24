set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_settings()
 RETURNS record
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

CREATE OR REPLACE FUNCTION public.update_threshold_for_detecting_overdrinking(threshold integer)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$update
  user_settings
set
  threshold_for_detecting_overdrinking = threshold
where
  user_id = auth.uid();
$function$
;


