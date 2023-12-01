set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sum_count_per_month(year integer, month integer)
 RETURNS TABLE(drink_id integer, count integer)
 LANGUAGE sql
AS $function$
select
  drink_id,
  sum(count)
from
  drink_counters
where
  user_id = auth.uid()
  and date >= date(concat(year, '/', month, '/1'))
  and date < date(concat(year, '/', month, '/1')) + interval '1 month'
group by
  drink_id;
$function$
;


