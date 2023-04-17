insert into
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
  )
values
  (
    '00000000-0000-0000-0000-000000000000',
    '5899f99d-a449-4bfa-8769-19c097aaf1f5',
    'authenticated',
    'authenticated',
    'admin@email.com',
    crypt('Passw0rd', gen_salt('bf')),
    now(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NULL,
    now(),
    now(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
  );

INSERT INTO
  auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
VALUES
  (
    '5899f99d-a449-4bfa-8769-19c097aaf1f5',
    '5899f99d-a449-4bfa-8769-19c097aaf1f5' :: uuid,
    '{"sub": "5899f99d-a449-4bfa-8769-19c097aaf1f5"}',
    'email',
    now(),
    now(),
    now()
  );

insert into
  public.drinks (id, name)
values
  (1, 'ビール'),
  (2, 'ハイボール'),
  (3, 'ウィスキー'),
  (4, '日本酒'),
  (5, 'ワイン'),
  (6, 'コーヒー');

insert into
  public.drink_counters (date, drink_id, count, user_id)
values
  (
    '2023-03-08',
    1,
    1,
    '5899f99d-a449-4bfa-8769-19c097aaf1f5' :: uuid
  );

