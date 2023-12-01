set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.bulk_update_drinks_sort(payload json)
 RETURNS void
 LANGUAGE sql
AS $function$
update
  drinks
set
  sort = x.sort
from
  (
    select
      id,
      sort
    from
      json_populate_recordset(null::drinks, payload)
  ) as x
where
  drinks.id = x.id returning drinks.*;
$function$
;


