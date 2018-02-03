-- Stores an hour of all TTC vehicle
-- locations in 15-second intervals

CREATE KEYSPACE ttc WITH REPLICATION = { 
    'class': 'SimpleStrategy',
    'replication_factor': 2 
};

CREATE TABLE ttc.ttc_realtime_vehicles ( 
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

ALTER TABLE ttc.ttc_realtime_vehicles ADD did ascii;
