drop index if exists "public"."drinks_name_keys";

CREATE UNIQUE INDEX drinks_user_id_drink_label_id_name_idx ON public.drinks USING btree (user_id, drink_label_id, name);


