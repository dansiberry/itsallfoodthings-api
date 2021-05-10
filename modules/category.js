exports.category = class Category {
    constructor(pool, index) {
        this.pool = pool;
        this.index = index;
    }

    async all() {
        const diets = await this.pool.query(`
          SELECT id, title AS title, 'diets' as category FROM diets;
        `);
        const types = await this.pool.query(`
          SELECT id, title AS title, 'types' as category FROM types;
        `);
        const courses = await this.pool.query(`
          SELECT id, title AS title, 'courses' as category FROM courses;
        `);
        const cuisines = await this.pool.query(`
          SELECT id, title AS title, 'cuisines' as category FROM cuisines;
        `);
        const chefs = await this.pool.query(`
          SELECT id, title AS title, 'chefs' AS category FROM chefs;
        `);
        const occasions = await this.pool.query(`
          SELECT id, title AS title, 'occasions' as category FROM occasions;
        `);
        return Promise.all([chefs, types, courses, cuisines, occasions, diets]);
    }

    async create({title, category}) {
        return await this.pool.query(`
          INSERT INTO ${category} (title) VALUES ('${title}');
        `);
    }
}