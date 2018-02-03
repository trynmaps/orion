-- Stores an hour of all Marin vehicle
-- locations in 15-second intervals

CREATE KEYSPACE marin WITH REPLICATION = { 
    'class': 'SimpleStrategy',
    'replication_factor': 1 
};

CREATE TABLE marin.marin_realtime_vehicles ( 
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

-- Adds Pattern ID

ALTER TABLE marin.marin_realtime_vehicles ADD did ascii;
