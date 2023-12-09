CREATE UNIQUE INDEX drink_counters_unique_keys ON public.drink_counters USING btree (user_id, date, drink_id);


