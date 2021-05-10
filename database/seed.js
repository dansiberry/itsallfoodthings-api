const Pool = require('pg').Pool;
const fs = require('fs');
const path = require('path');

const pool = new Pool ({
    user: 'dan',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'itsallfoodthings'
});

let data = fs.readFileSync(path.resolve(__dirname) + '/data.json');
let recipes = JSON.parse(data);

// SEED RECIPES
recipes.forEach(async (recipe) => {
    try {
        await pool.query("INSERT INTO recipes (title, steps, ingredients) VALUES($1, $2, $3)", [recipe.title, JSON.stringify(recipe.steps), JSON.stringify(recipe.ingredients)]);
    } catch (error) {
        console.log(error);
    }
});

let cats = {
    cuisine: [],
    chef: [],
    occasion: [],
    diet: [],
    course: [],
    type: []
}

// Gather all existing categories into map
recipes.forEach(recipe => {
    Object.keys(cats).forEach(cat => {
        const val = Array.isArray(recipe[cat]) ? recipe[cat] : [recipe[cat]];
        cats[cat] = [...cats[cat], ...val];
    });
});

// Filter out duplicate and nulls
Object.keys(cats).forEach(key => {
    cats[key] = Array.from(new Set(cats[key]));
    cats[key] = cats[key].filter(item => item);
})

// SEED CATEGORIES
Object.keys(cats).forEach((categoryKey) => {
    cats[categoryKey].forEach(async (value) => {
        try {
            await pool.query(`INSERT INTO ${categoryKey}s (title) VALUES($1)`, [value]);
        } catch (error) {
            console.log(error);
        }
    });
});

// Makes joins 
recipes.forEach(recipe => {
    Object.keys(cats).forEach(cat => {
        const data = Array.isArray(recipe[cat]) ? recipe[cat] : [recipe[cat]];
        data.forEach(async (item) => {
            if (item) {
                try {
                    let recipeId = await pool.query(`SELECT id FROM recipes WHERE title = '${recipe.title}' LIMIT 1`);
                    let catId = await pool.query(`SELECT id FROM ${cat}s WHERE title = '${item}' LIMIT 1`);
                    recipeId = recipeId.rows[0].id;
                    catId = catId.rows[0].id;
                    // console.log(`Recipe - ${recipe.title} , ID ${recipeId}, ${cat} ${catId} ${item}`);
                    await pool.query(`INSERT INTO recipe_${cat} (recipe_id, ${cat}_id) VALUES($1, $2)`, [recipeId, catId]);
                } catch (error) {
                    console.log(error.detail);
                }
            }
        });
    });
});