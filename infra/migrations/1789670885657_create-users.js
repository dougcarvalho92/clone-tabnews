exports.up = pgm => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    //for reference, Github username can be up to 39 characters long, but we will limit it to 30 for our application
    username: {
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      // Why 254 in length? https://stackoverflow.com/a/1199238
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      //Why 72 in length? https://security.stackexchange.com/a/39851
      type: "varchar(72)",
      notNull: true,
    },
    created_at: {
      // Why timestamp'tz' ? tz to add timezone information to the timestamp, so we can know when the user was created in UTC time https://justatheory.com/2012/04/postgres-use-timestamptz/
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = false;
