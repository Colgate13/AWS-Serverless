const resolvers = {
    // GET
    Query: {
        async getSkill(root, args, context, info) {
            return 'Hello world!'
        }
    },
    // POST (atualizações, cadastro, remoção)
    Mutation: {
        async createSkill(root, args, context, info) {
            return 'Hello world!'
        }
    }
}
module.exports = resolvers