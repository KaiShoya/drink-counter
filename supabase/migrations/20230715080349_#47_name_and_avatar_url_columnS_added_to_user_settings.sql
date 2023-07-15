alter table "public"."user_settings" add column "avatar_url" text;

alter table "public"."user_settings" add column "name" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_user_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.user_settings(user_id, name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data::json->>'name',
    new.raw_user_meta_data::json->>'avatar_url'
  );

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_user_settings()
 RETURNS record
 LANGUAGE sql
 SECURITY DEFINER
AS $function$select
  threshold_for_detecting_overdrinking,
  name,
  avatar_url
from
  user_settings
where
  user_id = auth.uid();
$function$
;


