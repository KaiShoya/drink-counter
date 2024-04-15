create table "public"."drink_labels" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "color" text,
    "sort" integer,
    "user_id" uuid not null default auth.uid(),
    "visible" boolean not null default true,
    "standard_amount" integer not null default 1
);


alter table "public"."drink_labels" enable row level security;

alter table "public"."drinks" add column "amount" integer;

alter table "public"."drinks" add column "drink_label_id" bigint;

CREATE UNIQUE INDEX drink_labels_pkey ON public.drink_labels USING btree (id);

CREATE UNIQUE INDEX drink_labels_user_id_name_key ON public.drink_labels USING btree (user_id, name);

CREATE UNIQUE INDEX drink_labels_user_id_sort_key ON public.drink_labels USING btree (user_id, sort);

alter table "public"."drink_labels" add constraint "drink_labels_pkey" PRIMARY KEY using index "drink_labels_pkey";

alter table "public"."drink_labels" add constraint "drink_labels_user_id_name_key" UNIQUE using index "drink_labels_user_id_name_key";

alter table "public"."drink_labels" add constraint "drink_labels_user_id_sort_key" UNIQUE using index "drink_labels_user_id_sort_key";

alter table "public"."drink_labels" add constraint "public_drink_labels_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."drink_labels" validate constraint "public_drink_labels_user_id_fkey";

alter table "public"."drinks" add constraint "public_drinks_drink_label_id_fkey" FOREIGN KEY (drink_label_id) REFERENCES drink_labels(id) not valid;

alter table "public"."drinks" validate constraint "public_drinks_drink_label_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.bulk_update_drink_labels_sort(payload json)
 RETURNS void
 LANGUAGE sql
AS $function$
update
  drink_labels
set
  sort = x.sort
from
  (
    select
      id,
      sort
    from
      json_populate_recordset(null::drink_labels, payload)
  ) as x
where
  drink_labels.id = x.id returning drink_labels.*;
$function$
;

grant delete on table "public"."drink_labels" to "anon";

grant insert on table "public"."drink_labels" to "anon";

grant references on table "public"."drink_labels" to "anon";

grant select on table "public"."drink_labels" to "anon";

grant trigger on table "public"."drink_labels" to "anon";

grant truncate on table "public"."drink_labels" to "anon";

grant update on table "public"."drink_labels" to "anon";

grant delete on table "public"."drink_labels" to "authenticated";

grant insert on table "public"."drink_labels" to "authenticated";

grant references on table "public"."drink_labels" to "authenticated";

grant select on table "public"."drink_labels" to "authenticated";

grant trigger on table "public"."drink_labels" to "authenticated";

grant truncate on table "public"."drink_labels" to "authenticated";

grant update on table "public"."drink_labels" to "authenticated";

grant delete on table "public"."drink_labels" to "service_role";

grant insert on table "public"."drink_labels" to "service_role";

grant references on table "public"."drink_labels" to "service_role";

grant select on table "public"."drink_labels" to "service_role";

grant trigger on table "public"."drink_labels" to "service_role";

grant truncate on table "public"."drink_labels" to "service_role";

grant update on table "public"."drink_labels" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."drink_labels"
as permissive
for all
to public
using ((auth.uid() = user_id));



