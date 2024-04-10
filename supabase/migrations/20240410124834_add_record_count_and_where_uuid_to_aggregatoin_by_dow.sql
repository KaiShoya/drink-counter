drop function if exists "public"."aggregation_by_dow"(year integer, month integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.aggregation_by_dow(year integer DEFAULT NULL::integer, month integer DEFAULT NULL::integer)
 RETURNS TABLE(dow integer, sum_count integer, avg_count integer, max_type_of_drinks integer, avg_type_of_drinks integer, record_count integer)
 LANGUAGE sql
AS $function$
SELECT
  id,
  COALESCE(sum_count, 0) AS sum_count,
  COALESCE(avg_count, 0) AS avg_count,
  COALESCE(max_type_of_drinks, 0) AS max_type_of_drinks,
  COALESCE(avg_type_of_drinks, 0) AS avg_type_of_drinks,
  COALESCE(record_count, 0) AS record_count
FROM
  (
    SELECT GENERATE_SERIES(0, 6) AS "id"
  ) AS "dow_num"
  LEFT JOIN
  (
      SELECT
        EXTRACT(DOW FROM date) AS "dow",
        SUM("sum_count") AS "sum_count",
        AVG("sum_count") AS "avg_count",
        MAX("type_of_drinks") AS "max_type_of_drinks",
        AVG("type_of_drinks") AS "avg_type_of_drinks",
        COUNT(1) AS "record_count"
      FROM
      (
        SELECT
          date,
          SUM("count") AS "sum_count", -- 飲んだ杯数
          COUNT("count") AS "type_of_drinks" -- 飲んだ種類
        FROM
          drink_counters
        WHERE "count" > 0
        AND user_id = auth.uid()
        AND CASE
          WHEN year IS NOT NULL THEN
            EXTRACT(YEAR FROM date) = year
            AND CASE
              WHEN month IS NOT NULL THEN
                EXTRACT(MONTH FROM date) = month
              ELSE true
            END
          ELSE true
        END
        GROUP BY date
      ) as cd
    GROUP BY "dow"
  ) AS dow_data on dow_num.id = dow_data.dow
ORDER BY dow ASC
$function$
;


