set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_drinks()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE label_id integer;
BEGIN
  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, 'ビール', 1, '#fdc700', 350) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, '中ジョッキ', 1, '#fdc700', 350, label_id),
    (new.id, true, '350ml', 2, '#fdc700', 350, label_id),
    (new.id, true, '500ml', 3, '#fdc700', 500, label_id);

  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, 'ハイボール', 2, '#96d35f', 350) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, '1杯', 4, '#96d35f', 350, label_id);

  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, 'ウィスキー', 3, '#7b2900', 30) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, 'ショット', 5, '#7b2900', 30, label_id),
    (new.id, true, 'ボトル', 6, '#7b2900', 700, label_id);

  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, '日本酒', 4, '#01c7fc', 180) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, '1合', 7, '#01c7fc', 180, label_id),
    (new.id, true, 'おちょこ', 8, '#01c7fc', 40, label_id);

  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, 'ワイン', 5, '#fefb41', 1) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, '白', 9, '#fefb41', 1, label_id),
    (new.id, true, '赤', 10, '#e63b7a', 1, label_id);

  INSERT INTO public.drink_labels(user_id, visible, name, sort, color, standard_amount)
  VALUES (new.id, true, '焼酎', 6, '#5e30eb', 1) RETURNING id INTO label_id;
  INSERT INTO public.drinks (user_id, visible, name, sort, color, amount, drink_label_id)
  VALUES
    (new.id, true, '1杯', 11, '#5e30eb', 1, label_id);

  RETURN new;
END;
$function$
;


