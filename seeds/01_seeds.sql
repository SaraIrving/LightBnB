
INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'evemail@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louise Meyer', 'louemail@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Sue Luna', 'sueemail@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Vancouver Dream House', 'description', 'https://shawglobalnews.files.wordpress.com/2017/02/262119142.jpg?quality=85&strip=all', 'https://assets-listings.rew.ca/brc_idx_rew/brc/R2425847/20200112091124/01.jpeg', 500, 5, 4, 4, 'Canada', 'Commercial Drive', 'Vancouver', 'British Columbia', 'V5Y 7H6', true),
(2, 'Whistler Dream House', 'description', 'https://images.glaciermedia.ca/polopoly_fs/1.23475492.1540422680!/fileImage/httpImage/image.jpg_gen/derivatives/landscape_804/whistler-cliff-mansion-main.jpg', 'https://images.glaciermedia.ca/polopoly_fs/1.23475530!/fileImage/httpImage/image.jpg_gen/derivatives/original_size/whistler-cliff-mansion-hot-tub.jpg', 5600, 5, 7, 9, 'Canada', 'Ski Drive', 'Whistler', 'British Columbia', 'X8Q 7H6', true),
(3, 'Burnaby Dream House', 'description', 'https://images.glaciermedia.ca/polopoly_fs/1.24049282.1578941592!/fileImage/httpImage/image.jpg_gen/derivatives/landscape_804/burnaby-housing.jpg', 'https://postmediavancouversun2.files.wordpress.com/2019/12/1204_house-w.jpg', 900, 2, 3, 3, 'Canada', 'Burn Drive', 'Burnaby', 'British Columbia', 'V9L 0O0', true);

INSERT INTO reservations (start_date, end_date, guest_id, property_id) 
VALUES ('2018-09-11', '2018-09-26', 1, 2),
('2019-01-04', '2019-02-01', 2, 3),
('2021-10-01', '2021-10-14', 3, 1);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 2, 1, 4, 'message'),
(2, 3, 2, 3, 'message'),
(3, 1, 3, 5, 'message');
