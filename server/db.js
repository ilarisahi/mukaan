'use strict';

var queries = [
    'SELECT event_instance.ei_id AS "id", event.name, event.description, event_instance.fee, group_concat(artist.name, ", ") AS "artist", venue.name AS "venue", event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id JOIN event_artist ON event.e_id = event_artist.e_id JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event_instance.ei_id ORDER BY event_instance.starts',
    'SELECT * FROM client WHERE c_id = ?',
    'INSERT INTO client (first_name, last_name, phone) VALUES (?, ?, ?)',
    'SELECT last_insert_rowid()',
    'UPDATE client SET first_name = ?, last_name = ?, phone = ? WHERE c_id = ?',
    'SELECT event_instance.ei_id AS "id", event.name, event.description, event_instance.fee, group_concat(artist.name, ", ") AS "artist", venue.name AS "venue", event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id JOIN event_artist ON event.e_id = event_artist.e_id JOIN artist ON event_artist.a_id = artist.a_id WHERE event_instance.ei_id = ? GROUP BY event_instance.ei_id ORDER BY event_instance.starts',
    'INSERT INTO event_instance_client (ei_id, c_id, ticket_class) VALUES (?, ?, ?)',
    'SELECT ticket_office.to_id, ticket_office.address, ticket_office.hours, organiser.o_id, organiser.name AS "organiser_name" FROM ticket_office JOIN organiser ON ticket_office.o_id = organiser.o_id',
    'SELECT * FROM organiser',
    'SELECT * FROM venue',
    'SELECT * FROM artist',
    'SELECT * FROM client',
    'SELECT event_instance_client.eic_id, event.name AS "event", venue.name AS "venue", event_instance.starts, SUM(CASE WHEN event_instance_client.ticket_class = 1 THEN 1 ELSE 0 END) AS "class_1", SUM(CASE WHEN event_instance_client.ticket_class = 2 THEN 1 ELSE 0 END) AS "class_2", SUM(CASE WHEN event_instance_client.ticket_class = 3 THEN 1 ELSE 0 END) AS "class_3" FROM event_instance_client JOIN event_instance ON event_instance.ei_id = event_instance_client.ei_id JOIN event ON event.e_id = event_instance.e_id JOIN venue ON venue.v_id = event_instance.v_id JOIN client ON event_instance_client.c_id = client.c_id WHERE client.c_id = ? GROUP BY event_instance.ei_id'
];

module.exports = { queries };