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
- Node 8 (`node --v` should be 8.\*.\*)
- Java 8 (`java -version` should be 1.8.*)
- Pip
- Python
- Set up Restbus (https://github.com/trynmaps/restbus)
- Cassandra 

## Cassandra Installation

### Mac
```shell
# Install Cassandra
brew install cassandra

# Start Cassandra Service
launchctl start homebrew.mxcl.cassandra

# To Stop Cassandra service and run
# launchctl stop homebrew.mxcl.cassandra
```
### Linux
```bash
#Install Cassandra
echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
sudo apt-get update
sudo apt-get install cassandra

# Start Cassandra Service
sudo service cassandra start

# Stop Cassandra Service
# sudo service cassandra stop
 ```


## Steps

1. Clone this repo.
2. Install cqlsh via `pip install cql`.
3. Run `cassandra` to start Cassandra.
4. Run `cqlsh` in your terminal. This confirms that Cassandra is running.
5. Go to each folder in `agency`, and run each of the CQL scripts (do this by running the contents in the `cqlsh` terminal).
6. Run `npm install`.
7. Ensure restbus (https://github.com/trynmaps/restbus) is running.
8. Run `npm start`. Remember to eventually stop this as otherwise Cassandra will eat all your memory. If that's the case, feel free to truncate the table.


