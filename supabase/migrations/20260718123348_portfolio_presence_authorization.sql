-- Presence only: no visitor-log table is created. Private Realtime channels
-- evaluate these policies for the anonymous authenticated role.
drop policy if exists "portfolio presence read" on realtime.messages;
drop policy if exists "portfolio presence write" on realtime.messages;

create policy "portfolio presence read"
on realtime.messages
for select
to authenticated
using (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension = 'presence'
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
);

create policy "portfolio presence write"
on realtime.messages
for insert
to authenticated
with check (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension = 'presence'
  and coalesce((select (auth.jwt() ->> 'is_anonymous')::boolean), false)
);
