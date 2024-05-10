create policy "Enable all for users based on user_id"
on "public"."drinks"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."drinks"
as permissive
for insert
to authenticated
with check (true);



