'use strict';

var selectQueries = [
    'SELECT event_instance.ei_id AS "id", event.name, event.description, event_instance.fee, group_concat(artist.name, ", ") AS "artist", venue.name AS "venue", event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id LEFT OUTER JOIN event_artist ON event.e_id = event_artist.e_id LEFT OUTER JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event_instance.ei_id ORDER BY event_instance.starts',
    'SELECT * FROM client WHERE c_id = ?',
    'SELECT event_instance.ei_id AS "id", event.name, event.description, event_instance.fee, group_concat(artist.name, ", ") AS "artist", venue.name AS "venue", event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id LEFT OUTER JOIN event_artist ON event.e_id = event_artist.e_id LEFT OUTER JOIN artist ON event_artist.a_id = artist.a_id WHERE event_instance.ei_id = ?',
    'SELECT ticket_office.to_id, ticket_office.address, ticket_office.hours, organiser.o_id, organiser.name AS "organiser_name" FROM ticket_office JOIN organiser ON ticket_office.o_id = organiser.o_id',
    'SELECT * FROM organiser',
    'SELECT * FROM venue',
    'SELECT * FROM artist',
    'SELECT * FROM client',
    'SELECT event_instance_client.eic_id, event.name AS "event", venue.name AS "venue", event_instance.starts, SUM(CASE WHEN event_instance_client.ticket_class = 1 THEN 1 ELSE 0 END) AS "class_1", SUM(CASE WHEN event_instance_client.ticket_class = 2 THEN 1 ELSE 0 END) AS "class_2", SUM(CASE WHEN event_instance_client.ticket_class = 3 THEN 1 ELSE 0 END) AS "class_3" FROM event_instance_client JOIN event_instance ON event_instance.ei_id = event_instance_client.ei_id JOIN event ON event.e_id = event_instance.e_id JOIN venue ON venue.v_id = event_instance.v_id JOIN client ON event_instance_client.c_id = client.c_id WHERE client.c_id = ? GROUP BY event_instance.ei_id',
    'SELECT event.*, group_concat(artist.a_id, ",") AS "artists" FROM event LEFT OUTER JOIN event_artist ON event.e_id = event_artist.e_id LEFT OUTER JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event.e_id',
    'SELECT event_instance.ei_id, event.e_id, event.name, event_instance.fee, venue.v_id, event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id LEFT OUTER JOIN event_artist ON event.e_id = event_artist.e_id LEFT OUTER JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event_instance.ei_id ORDER BY event_instance.starts',
    'SELECT event_instance_client.eic_id, event.name, event_instance.starts, venue.name AS "venue", client.c_id, client.first_name, client.last_name, event_instance_client.ticket_class FROM event_instance_client JOIN event_instance ON event_instance_client.ei_id = event_instance.ei_id JOIN event ON event.e_id = event_instance.e_id JOIN client ON client.c_id = event_instance_client.c_id JOIN venue ON venue.v_id = event_instance.v_id',
    'SELECT event_instance.ei_id, event.e_id, event.name, event.description, event.cost, event_instance.fee, group_concat(DISTINCT(artist.name)) AS "artists", venue.name AS "venue", venue.capacity_1, venue.capacity_2, venue.capacity_3, event_instance.starts, event_instance.ends, SUM(CASE WHEN event_instance_client.ticket_class = 1 THEN 1 ELSE 0 END) AS "class_1", SUM(CASE WHEN event_instance_client.ticket_class = 2 THEN 1 ELSE 0 END) AS "class_2", SUM(CASE WHEN event_instance_client.ticket_class = 3 THEN 1 ELSE 0 END) AS "class_3" FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id LEFT OUTER JOIN event_instance_client ON event_instance_client.ei_id = event_instance.ei_id JOIN event ON event_instance.e_id = event.e_id LEFT OUTER JOIN event_artist ON event.e_id = event_artist.e_id LEFT OUTER JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event_instance.ei_id ORDER BY event.e_id'
];

var insertQueries = [
    'INSERT INTO artist (name, category, phone) VALUES (?, ?, ?)',
    'INSERT INTO client (first_name, last_name, phone) VALUES (?, ?, ?)',
    'INSERT INTO organiser (name, www) VALUES (?, ?)',
    'INSERT INTO venue (name, address, capacity_1, capacity_2, capacity_3) VALUES (?, ?, ?, ?, ?)',
    'INSERT INTO ticket_office (o_id, address, hours) VALUES (?, ?, ?)',
    'INSERT INTO event (o_id, name, description, cost) VALUES (?, ?, ?, ?)',
    'INSERT INTO event_artist (e_id, a_id) VALUES (?, ?)',
    'INSERT INTO event_instance (e_id, v_id, fee, starts, ends) VALUES (?, ?, ?, ?, ?)',
    'INSERT INTO event_instance_client (ei_id, c_id, ticket_class) VALUES (?, ?, ?)'
];

var updateQueries = [
    'UPDATE artist SET name = ?, category = ?, phone = ? WHERE a_id = ?',
    'UPDATE client SET first_name = ?, last_name = ?, phone = ? WHERE c_id = ?',
    'UPDATE organiser SET name = ?, www = ? WHERE o_id = ?',
    'UPDATE venue SET name = ?, address = ?, capacity_1 = ?, capacity_2 = ?, capacity_3 = ? WHERE v_id = ?',
    'UPDATE ticket_office SET o_id = ?, address = ?, hours = ? WHERE to_id = ?',
    'UPDATE event SET o_id = ?, name = ?, description = ?, cost = ? WHERE e_id = ?',
    'UPDATE event_artist SET e_id = ?, a_id = ? WHERE e_id = ? AND a_id = ?',
    'UPDATE event_instance SET v_id = ?, fee = ?, starts = ?, ends = ? WHERE ei_id = ?',
    'UPDATE event_instance_client SET ticket_class = ? WHERE eic_id = ?'
];

var deleteQueries = [
    'DELETE FROM artist WHERE a_id = ?',
    'DELETE FROM client WHERE c_id = ?',
    'DELETE FROM organiser WHERE o_id = ?',
    'DELETE FROM venue WHERE v_id = ?',
    'DELETE FROM ticket_office WHERE to_id = ?',
    'DELETE FROM event WHERE e_id = ?',
    'DELETE FROM event_artist WHERE e_id = ? AND a_id = ?',
    'DELETE FROM event_instance WHERE ei_id = ?',
    'DELETE FROM event_instance_client WHERE eic_id = ?'
];


module.exports = { selectQueries, insertQueries, updateQueries, deleteQueries };