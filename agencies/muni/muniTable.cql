-- Stores an hour of all Muni vehicle
-- locations in 15-second intervals

CREATE KEYSPACE muni WITH REPLICATION = { 
    'class': 'SimpleStrategy',
    'replication_factor': 1 
};

CREATE TABLE muni.muni_realtime_vehicles ( 
    vdate date,
    vhour smallint,
    rid ascii,
    vid ascii,
    vtime timestamp,
    lat float,
    lon float,
    heading int,
    did ascii,
PRIMARY KEY ((vdate, vhour), vtime, rid, vid)
);

-- Adds Direction ID

ALTER TABLE muni.muni_realtime_vehicles ADD did ascii;
