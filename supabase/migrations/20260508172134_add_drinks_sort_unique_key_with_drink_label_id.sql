CREATE UNIQUE INDEX drinks_user_id_label_sort_key ON public.drinks USING btree (user_id, COALESCE(drink_label_id, (0)::bigint), sort);


