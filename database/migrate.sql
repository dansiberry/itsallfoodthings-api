CREATE TABLE IF NOT EXISTS recipes(
    id SERIAL PRIMARY KEY,
    title text,
    ingredients json,
    steps json
);

CREATE TABLE IF NOT EXISTS courses (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_course (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, course_id int REFERENCES courses (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_course_pkey PRIMARY KEY (recipe_id, course_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS chefs (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_chef (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, chef_id int REFERENCES chefs (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_chef_pkey PRIMARY KEY (recipe_id, chef_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS occasions (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_occasion (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, occasion_id int REFERENCES occasions (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_occasion_pkey PRIMARY KEY (recipe_id, occasion_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS cuisines (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_cuisine (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, cuisine_id int REFERENCES cuisines (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_cuisine_pkey PRIMARY KEY (recipe_id, cuisine_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS bookmarks (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_bookmark (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, bookmark_id int REFERENCES bookmarks (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_bookmark_pkey PRIMARY KEY (recipe_id, bookmark_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS diets (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_diet (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, diet_id int REFERENCES diets (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_diet_pkey PRIMARY KEY (recipe_id, diet_id)  -- explicit pk
);


CREATE TABLE IF NOT EXISTS types (
  id serial PRIMARY KEY  -- implicit primary key constraint
, title    text NOT NULL
);
CREATE TABLE IF NOT EXISTS recipe_type (
  recipe_id    int REFERENCES recipes (id) ON UPDATE CASCADE ON DELETE CASCADE
, type_id int REFERENCES types (id) ON UPDATE CASCADE ON DELETE CASCADE
, CONSTRAINT recipe_type_pkey PRIMARY KEY (recipe_id, type_id)  -- explicit pk
);