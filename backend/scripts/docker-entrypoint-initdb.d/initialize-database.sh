#!/bin/bash

# https://www.gnu.org/software/bash/manual/bash.html#The-Set-Builtin
# -e  Exit immediately if a command exits with a non-zero status.
# -x Print commands and their arguments as they are executed.
set -x

echo "Your environments..."
DATABASE_DEV=db_development
DATABASE_PRD=db_production

echo "App playground"
APP_SCHEMA_DEV=raveofphonetics_dev
APP_SCHEMA_PRD=raveofphonetics_prd

echo "Each app must have its own role/username"
APP_ROLE_DEV=role_raveofphonetics_dev
APP_ROLE_PRD=role_raveofphonetics_prd
echo "Defining default password for test purpose"
APP_DEFAULT_PASSWORD=please-dont-use-this-password-ever

echo "###### Creating development environment. Now loading..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE "$DATABASE_DEV";
  \c "$DATABASE_DEV";

  CREATE SCHEMA IF NOT EXISTS "$APP_SCHEMA_DEV";

  CREATE ROLE "$APP_ROLE_DEV" WITH LOGIN CREATEDB PASSWORD '$APP_DEFAULT_PASSWORD';
  GRANT ALL PRIVILEGES ON SCHEMA "$APP_SCHEMA_DEV" TO "$APP_ROLE_DEV";
EOSQL

echo "###### Creating production environment. Now loading..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE "$DATABASE_PRD";
  \c "$DATABASE_PRD";

  CREATE SCHEMA IF NOT EXISTS "$APP_SCHEMA_PRD";

  CREATE ROLE "$APP_ROLE_PRD" WITH LOGIN CREATEDB PASSWORD '$APP_DEFAULT_PASSWORD';
  GRANT ALL PRIVILEGES ON SCHEMA "$APP_SCHEMA_PRD" TO "$APP_ROLE_PRD";
EOSQL