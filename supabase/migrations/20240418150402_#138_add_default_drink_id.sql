alter table "public"."drink_labels" add column "default_drink_id" bigint;

alter table "public"."drink_labels" add constraint "public_drink_labels_default_drink_id_fkey" FOREIGN KEY (default_drink_id) REFERENCES drinks(id) not valid;

alter table "public"."drink_labels" validate constraint "public_drink_labels_default_drink_id_fkey";


