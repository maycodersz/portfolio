alter policy "portfolio presence read"
on realtime.messages
using (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension in ('presence', 'broadcast')
  and coalesce((((select auth.jwt()) ->> 'is_anonymous')::boolean), false)
);

alter policy "portfolio presence write"
on realtime.messages
with check (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension = 'presence'
  and coalesce((((select auth.jwt()) ->> 'is_anonymous')::boolean), false)
);
