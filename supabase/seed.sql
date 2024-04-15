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
    provider_id,
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
  public.drink_labels (id, name, sort, user_id)
values
  (1, 'ビール', 1, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (2, 'ハイボール', 2, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (3, 'ウィスキー', 3, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (4, '日本酒', 4, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (5, 'ワイン', 5, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (6, 'コーヒー', 6, '5899f99d-a449-4bfa-8769-19c097aaf1f5');

insert into
  public.drinks (id, name, sort, drink_label_id, user_id)
values
  (1, '缶ビール 350ml', 8, 1, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (2, '缶ビール 500ml', 7, 1, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (3, 'ビール 中ジョッキ', 1, 1, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (4, 'ハイボール', 2, 2, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (5, 'ウィスキー', 3, 3, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (6, '日本酒 1合', 4, 4, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (7, '日本酒 おちょこ1杯', 9, 4, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (8, 'ワイン', 5, 5, '5899f99d-a449-4bfa-8769-19c097aaf1f5'),
  (9,'コーヒー', 6, 6, '5899f99d-a449-4bfa-8769-19c097aaf1f5');

insert into
  public.drink_counters (date, drink_id, count, user_id)
values
  (
    '2023-03-08',
    1,
    1,
    '5899f99d-a449-4bfa-8769-19c097aaf1f5' :: uuid
  );
