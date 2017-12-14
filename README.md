## Orion

Finds (or rather, hunts for) transit data (agencies, routes (GeoJSON), realtime vehicle locations) and sends it to Cassandra

## Etymology

Many TTC buses are of the Orion VII Model while Orion was also a giant huntsman that could walk on water (being Poseidon's son). Orion and Cassandra are both Greek mythological figures.

## Getting Started

See our welcome doc for contribution and deployment guidelines.
https://docs.google.com/document/d/1KTWRc4EO63_lDxjcp0mmprgrFPfFazWJEy2MwxBuw4E/edit?usp=sharing

## MacOS

## Prerequisites

- Homebrew
- Node 8 (`node --v` should be 8.*.*)
- Java 8 (`java -version` should be 1.8.*)
- Pip
- Python

## Steps

1. Clone this repo.
2. Install cqlsh via `pip install cql`.
3. Install Cassandra via `brew install cassandra`.
4. Start Cassandra via `launchctl start homebrew.mxcl.cassandra`.
   You can stop Cassandra via `launchctl stop homebrew.mxcl.cassandra`.
5. Run `cassandra` to start Cassandra.
6. Run `cqlsh` in your terminal. This confirms that Cassandra is running.
7. Go to tables, and run each of the CQL scripts (do this by running the contents of each file into the `cqlsh` terminal).
8. Run `npm install`.
9. Ensure restbus (https://github.com/trynmaps/restbus) is running.
10. Run `npm start`. Remember to eventually stop this as otherwise Cassandra will eat all your memory. If that's the case, feel free to truncate the table.

## Linux

TODO
