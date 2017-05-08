'use strict';

var queries = [
    'SELECT event.name, event.description, event_instance.fee, group_concat(artist.name, ", ") AS "artist", venue.name AS "venue", event_instance.starts, event_instance.ends FROM event_instance JOIN venue ON event_instance.v_id = venue.v_id JOIN event ON event_instance.e_id = event.e_id JOIN event_artist ON event.e_id = event_artist.e_id JOIN artist ON event_artist.a_id = artist.a_id GROUP BY event_instance.ei_id ORDER BY event_instance.starts',
    'SELECT * FROM client WHERE c_id = ?',
    'INSERT INTO client (first_name, last_name, phone) VALUES (?, ?, ?)',
    'SELECT last_insert_rowid()'
];

module.exports = { queries };