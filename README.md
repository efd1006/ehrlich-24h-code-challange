# Ehrlich 24h Coding Challange

## Installation

```bash
$ npm install
```

## Environment
Copy .env.example then fillup all the required credentials for setting up the environment
```bash
$ cp .env.example .env
```

## Database Related (migration, seed, setup)

```bash
# Setup Database (build dist -> reset db -> run migration -> run seed)
$ npm run db:setup

# Generate migration based on created entity (auto generated)
$ npm run migration:generate -n <migration_name>

# Create an empty migration file
$ npm run migration:create -n <migration_name>

# Running the migration
$ npm run migration:run

# Revert a migration
$ npm run migration:revert

# Run the seeder
$ npm run seed

# Run specific seed class
$ npm run seed:class <ClassName>

# Show seeding connection config
$ npm run seed:config

# Drop all the schema (Hard reset)
$ npm run schema:drop

```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## OpenAPI
All the API Docs are auto generated thru @nestjs/swagger and is accessible thru:
```bash
/api/docs
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  Nest is [MIT licensed](LICENSE).
