## Orion

Fetches transit data (realtime vehicle locations) and saves it to S3

## Etymology

Many TTC buses are of the Orion VII Model while Orion was also a giant huntsman that could walk on water (being Poseidon's son).

## Getting Started

See our welcome doc for contribution and deployment guidelines.
https://docs.google.com/document/d/1KTWRc4EO63_lDxjcp0mmprgrFPfFazWJEy2MwxBuw4E/edit?usp=sharing

## Usage

Each instance of orion can fetch data from one transit agency at a time. To fetch data for multiple agencies at once, run multiple instances of orion.

Orion is configured via environment variables.

`ORION_S3_BUCKET`: The name of the S3 bucket where transit data will be written.

`ORION_AGENCY_ID`: The ID of the transit agency, which will appear in the S3 keys written to `ORION_S3_BUCKET`.

`ORION_PROVIDER`: The module name in the providers directory (e.g. 'nextbus') which provides an API for real-time vehicle locations.

`ORION_PROVIDER_AGENCY_ID`: The ID of the transit agency as used by the provider (not needed if the provider only supports one transit agency).

Orion writes data to S3 using the AWS credentials from the default locations, e.g. a credentials file located within the Docker container at /root/.aws/credentials (using the default profile or a profile named by AWS_PROFILE), or using the environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

In a development environment, you can set environment variables and AWS credentials by creating a file in the root of this repository named docker-compose.override.yml, e.g.:

```
version: "3.7"
services:
  orion-dev:
    volumes:
      - ../.aws:/root/.aws
    environment:
      AWS_PROFILE: "default"
      ORION_S3_BUCKET: "my-opentransit-data" # assumes you created this S3 bucket in the AWS console
      ORION_AGENCY_ID: "muni"
      ORION_PROVIDER: "nextbus"
      ORION_PROVIDER_AGENCY_ID: "sf-muni"
```

To test, run `docker-compose up`.

## Prerequisites

Docker
