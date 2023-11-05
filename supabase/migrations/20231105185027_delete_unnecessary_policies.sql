drop policy "Enable insert for authenticated users only" on "public"."drink_counters";

drop policy "Enable insert for authenticated users only" on "public"."drinks";

alter table "public"."drinks" alter column "user_id" set default auth.uid();


