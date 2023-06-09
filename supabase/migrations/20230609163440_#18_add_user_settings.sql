create table "public"."user_settings" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid not null,
    "threshold_for_detecting_overdrinking" smallint not null default '2'::smallint,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."user_settings" enable row level security;

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id);

CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings USING btree (user_id);

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_key" UNIQUE using index "user_settings_user_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_user_settings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.user_settings(user_id)
  values (new.id);

  return new;
end;$function$
;

CREATE TRIGGER create_user_settings AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_settings();

-- 既存ユーザの初期データ作成
insert into user_settings(user_id) select id from auth.users;
