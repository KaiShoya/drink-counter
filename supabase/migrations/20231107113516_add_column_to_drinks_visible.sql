alter table "public"."drinks" add column "visible" boolean not null default true;

alter table "public"."drinks" alter column "created_at" set not null;


