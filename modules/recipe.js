exports.recipe = class Recipe {
    constructor(pool, index) {
        this.pool = pool;
        this.index = index;
    }

    async create({title, steps, ingredients, activeCategories}) {
        try {
            const newRecipe = await this.pool.query(`
              INSERT INTO recipes (title, steps, ingredients)
              VALUES ($1, $2, $3)
              RETURNING id;
            `, [title, JSON.stringify(steps), JSON.stringify(ingredients)]);

            const newRecipeID = newRecipe.rows[0].id;

            let promises = [];

            activeCategories.forEach((cat) => {
                const categoryTitle = cat.category.slice(0, -1);
                cat.rows.forEach(row => {
                    promises.push(
                        this.pool.query(`
                            INSERT INTO recipe_${categoryTitle} (recipe_id, ${categoryTitle}_id)
                            VALUES ($1, $2);
                            `, [newRecipeID, row.id ])
                    );
                });
            });
            await Promise.all(promises)
            return newRecipeID;
        } catch(error) {
            throw new Error (error.stack)
        }
    }

    async update({title, steps, ingredients, activeCategories, id}) {
        try {
            await this.pool.query(`
                UPDATE recipes
                SET title = '${title}',
                steps = '${JSON.stringify(steps)}',
                ingredients = '${JSON.stringify(ingredients)}'
                WHERE id = ${id};
            `);

            await this.pool.query(`
                DELETE FROM recipe_chef WHERE recipe_id = ${id};
                DELETE FROM recipe_occasion WHERE recipe_id = ${id};
                DELETE FROM recipe_diet WHERE recipe_id = ${id};
                DELETE FROM recipe_course WHERE recipe_id = ${id};
                DELETE FROM recipe_cuisine WHERE recipe_id = ${id};
                DELETE FROM recipe_type WHERE recipe_id = ${id};
            `);

            let promises = [];
            activeCategories.forEach(cat => {
                const catTitle = cat.category.slice(0, -1);
                cat.rows.forEach(row => {
                    promises.push(
                        this.pool.query(`INSERT INTO recipe_${catTitle} (recipe_id, ${catTitle}_id) VALUES (${id}, ${row.id})`)
                    );
                });
            });

            return await Promise.all(promises)
        } catch(error) {
            throw new Error (error.stack)
        }
    }

    async delete(id) {
        try {
            await this.pool.query(`DELETE FROM recipes WHERE id = ${id};`);
        } catch(error) {
            throw new Error (error.stack)
        }
    }

    async one(id) {
        return this.pool.query(`
          SELECT recipes.title, recipes.steps, recipes.ingredients, recipes.id "objectID",
          COALESCE(json_agg(DISTINCT occasions) filter (WHERE occasions IS NOT null), '[]') occasions,
          COALESCE(json_agg(DISTINCT chefs) filter (WHERE chefs IS NOT null), '[]') chefs,
          COALESCE(json_agg(DISTINCT types) filter (WHERE types IS NOT null), '[]') "types",
          COALESCE(json_agg(DISTINCT courses) filter (WHERE courses IS NOT null), '[]') courses,
          COALESCE(json_agg(DISTINCT diets) filter (WHERE diets IS NOT null), '[]') diets,
          COALESCE(json_agg(DISTINCT cuisines) filter (WHERE cuisines IS NOT null), '[]') cuisines
          FROM recipes
          FULL JOIN recipe_occasion ON recipes.id = recipe_occasion.recipe_id
          FULL JOIN recipe_chef ON recipes.id = recipe_chef.recipe_id
          FULL JOIN recipe_cuisine ON recipes.id = recipe_cuisine.recipe_id
          FULL JOIN recipe_course ON recipes.id = recipe_course.recipe_id
          FULL JOIN recipe_diet ON recipes.id = recipe_diet.recipe_id
          FULL JOIN recipe_type ON recipes.id = recipe_type.recipe_id
          FULL JOIN occasions ON recipe_occasion.occasion_id = occasions.id
          FULL JOIN chefs ON recipe_chef.chef_id = chefs.id
          FULL JOIN courses ON recipe_course.course_id = courses.id
          FULL JOIN types ON recipe_type.type_id = types.id
          FULL JOIN cuisines ON recipe_cuisine.cuisine_id = cuisines.id
          FULL JOIN diets ON recipe_diet.diet_id = diets.id
          WHERE recipes.id = ${id}
          GROUP BY recipes.title, recipes.id;
        `);
    }

    all() {
        return this.pool.query(`
            SELECT recipes.title, recipes.steps, recipes.ingredients, recipes.id "objectID",
            COALESCE(json_agg(DISTINCT occasions) filter (WHERE occasions IS NOT null), '[]') occasions,
            COALESCE(json_agg(DISTINCT chefs) filter (WHERE chefs IS NOT null), '[]') chefs,
            COALESCE(json_agg(DISTINCT types) filter (WHERE types IS NOT null), '[]') "types",
            COALESCE(json_agg(DISTINCT courses) filter (WHERE courses IS NOT null), '[]') courses,
            COALESCE(json_agg(DISTINCT diets) filter (WHERE diets IS NOT null), '[]') diets,
            COALESCE(json_agg(DISTINCT cuisines) filter (WHERE cuisines IS NOT null), '[]') cuisines
            FROM recipes
            FULL JOIN recipe_occasion ON recipes.id = recipe_occasion.recipe_id
            FULL JOIN recipe_chef ON recipes.id = recipe_chef.recipe_id
            FULL JOIN recipe_cuisine ON recipes.id = recipe_cuisine.recipe_id
            FULL JOIN recipe_course ON recipes.id = recipe_course.recipe_id
            FULL JOIN recipe_diet ON recipes.id = recipe_diet.recipe_id
            FULL JOIN recipe_type ON recipes.id = recipe_type.recipe_id
            FULL JOIN occasions ON recipe_occasion.occasion_id = occasions.id
            FULL JOIN chefs ON recipe_chef.chef_id = chefs.id
            FULL JOIN courses ON recipe_course.course_id = courses.id
            FULL JOIN types ON recipe_type.type_id = types.id
            FULL JOIN cuisines ON recipe_cuisine.cuisine_id = cuisines.id
            FULL JOIN diets ON recipe_diet.diet_id = diets.id
            GROUP BY recipes.title, recipes.id;
        `);
    }
}