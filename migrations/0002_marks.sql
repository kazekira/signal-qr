create table if not exists marks (
  id          text primary key,
  user_id     text not null,
  title       text not null,
  kind        text not null,
  payload     text not null,
  preset      text not null,
  fg          text not null,
  bg          text not null,
  ecc         text not null,
  module_size integer not null,
  quiet_zone  integer not null,
  shape       text not null default 'square',
  fields_json text not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists marks_user_id_idx on marks (user_id, created_at desc);
