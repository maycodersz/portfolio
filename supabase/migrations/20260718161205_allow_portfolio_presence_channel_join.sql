-- The Realtime channel join performs a read authorization check for the
-- channel's default Broadcast configuration before Presence is synchronized.
-- Permit that read on this one topic while keeping Broadcast writes denied.
alter policy "portfolio presence read"
on realtime.messages
using (
  (select realtime.topic()) = 'site:portfolio:presence'
  and realtime.messages.extension in ('presence', 'broadcast')
  and coalesce(
    (
      coalesce(current_setting('request.jwt.claims', true), '{}')::jsonb
      ->> 'is_anonymous'
    )::boolean,
    false
  )
);
