set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_drinks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.drinks(user_id, visible, name)
  select new.id, true, name from public.drinks where user_id is null;

  return new;
end;$function$
;

CREATE TRIGGER create_drinks AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_drinks();
