psql -h localhost -U postgres -f '.\server\psql-schema\create_tables.psql'
schemats generate -c 'postgres://postgres:welcome@localhost/postgres' -s salesforce -o '.\server\utils\salesforce.ts'