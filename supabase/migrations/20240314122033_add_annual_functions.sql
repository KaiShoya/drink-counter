set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sum_count_per_year(year integer)
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
  and date >= date(concat(year, '/1/1'))
  and date < date(concat(year, '/1/1')) + interval '1 year'
group by
  drink_id;
$function$
;


