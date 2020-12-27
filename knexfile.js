require("dotenv").config({ path: "./.env" });
// Update with your config settings.
const pgConnection = process.env.DATABASE_URL;
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      database: "psfserver",
      user: "postgres",
      password: process.env.PASSWORD
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  },
  testing: {
    client: "pg",
    connection: {
      host: "localhost",
      database: "psfserver",
      user: "postgres",
      password: process.env.PASSWORD
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/testSeeds"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "pg",
    connection: pgConnection,
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds"
    }
  }
};
