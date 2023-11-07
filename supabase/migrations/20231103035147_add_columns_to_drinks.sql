alter table "public"."drinks" add column "color" character varying;

alter table "public"."drinks" add column "sort" integer;

alter table "public"."drinks" add column "user_id" uuid;

alter table "public"."drinks" enable row level security;

CREATE UNIQUE INDEX drinks_name_keys ON public.drinks USING btree (user_id, name);

alter table "public"."drinks" add constraint "drinks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."drinks" validate constraint "drinks_user_id_fkey";

alter table "public"."drinks" drop constraint "genres_name_key";

drop index if exists "public"."genres_name_key";

DO
$$
  DECLARE
    users_records CURSOR FOR SELECT id FROM "auth"."users";
    drinks_records CURSOR FOR SELECT id, name FROM "public"."drinks" ORDER BY id;
    new_id int;
  BEGIN
    <<users>>
    FOR user_record IN users_records LOOP
      <<drinks>>
      FOR drink IN drinks_records LOOP
        -- 新しい飲み物のレコードを作成
        EXECUTE 'INSERT INTO "public"."drinks" ("name", "user_id") VALUES ($1, $2) RETURNING id' INTO new_id USING drink.name, user_record.id;
        -- drink_countersの飲み物IDを更新
        EXECUTE 'UPDATE "public"."drink_counters" SET drink_id = $1 WHERE user_id = $2 AND drink_id = $3;' USING new_id, user_record.id, drink.id;
      END LOOP drinks;
    END LOOP users;
  END;
$$ LANGUAGE plpgsql;
