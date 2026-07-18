-- Realtime Authorization exposes JWT claims through request.jwt.claims.
-- Reading the setting directly follows the Realtime policy contract and
-- keeps this private channel limited to anonymous Auth sessions.
alter policy "portfolio presence read"
on realtime.messages
using (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension = 'presence'
  and coalesce(
    (
      coalesce(current_setting('request.jwt.claims', true), '{}')::jsonb
      ->> 'is_anonymous'
    )::boolean,
    false
  )
);

alter policy "portfolio presence write"
on realtime.messages
with check (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension = 'presence'
  and coalesce(
    (
      coalesce(current_setting('request.jwt.claims', true), '{}')::jsonb
      ->> 'is_anonymous'
    )::boolean,
    false
  )
);
