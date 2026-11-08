insert into public.categories(name,slug,description,display_order) values
('Buy & Sell Poultry','poultry-buy-sell','Connect with poultry listings and find the birds your farm needs.',1),
('Hatching Eggs','hatching-eggs','Explore hatching egg batches, quantities and supplier details.',2),
('Layer Birds','layer-birds','Find layer birds for your operation, with listing details to review.',3),
('Buying Birds','buying-birds','Browse bird sourcing listings and connect with poultry suppliers.',4),
('Chicken Sale','chicken-sale','Explore poultry meat listings with product and availability details.',5),
('Chick Sale','chick-sale','Find chick listings and review batch and supplier information.',6),
('Rabbit','rabbit','Browse rabbit listings and connect with suppliers.',7),
('Meat Rabbits','meat-rabbits','Browse rabbits raised for meat production.',8),
('Breeding Rabbits','breeding-rabbits','Find breeding rabbits and review breed and health details.',9),
('Pet Rabbits','pet-rabbits','Explore rabbits offered as pets.',10),
('Rabbit Sell & Poultry','rabbit-sell-poultry','Browse rabbit and poultry sale listings.',11)
on conflict(slug) do update set
  name = excluded.name,
  description = excluded.description,
  display_order = excluded.display_order;
