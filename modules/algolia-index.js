exports.algoliaIndex = class AlgoliaIndex {
    constructor(pool, index, recipe) {
        this.pool = pool;
        this.index = index;
        this.Recipe = recipe;
    }

    async add(id) {
        const data = await this.Recipe.one(id);
        this.index.saveObject(data.rows[0]);
    }

    async delete(id) {
        this.index.deleteObject(id);
    }

    async update(id) {
        const data = await this.Recipe.one(id);
        this.index.partialUpdateObject(data.rows[0]);
    }

    async syncAll() {
      const data = await this.Recipe.all();
      return await this.index.replaceAllObjects(data.rows, { safe: true });
    }
}