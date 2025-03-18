-- Fix the domains table to use position_x and position_y without tasks column
INSERT INTO domains (id, name, url, position_x, position_y, created_at, category)
VALUES
  (gen_random_uuid(), 'finansowyplac.pl', 'https://finansowyplac.pl', 50, 100, now(), 'finance'),
  (gen_random_uuid(), 'kredytjuzdzis.pl', 'https://kredytjuzdzis.pl', 200, 100, now(), 'finance'),
  (gen_random_uuid(), 'kredytoweprzypadki.pl', 'https://kredytoweprzypadki.pl', 350, 100, now(), 'finance'),
  (gen_random_uuid(), 'kredytnazycie.pl', 'https://kredytnazycie.pl', 500, 100, now(), 'finance'),
  (gen_random_uuid(), 'toseemore.pl', 'https://toseemore.pl', 50, 250, now(), 'general'),
  (gen_random_uuid(), 'access-technology.net', 'https://access-technology.net', 200, 250, now(), 'tech'),
  (gen_random_uuid(), 'LatestExam.de', 'https://LatestExam.de', 350, 250, now(), 'education'),
  (gen_random_uuid(), 'ushops.net', 'https://ushops.net', 500, 250, now(), 'ecommerce');