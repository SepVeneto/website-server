"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDef = void 0;
const graphql_1 = require("graphql");
const columns_1 = require("./models/columns");
exports.typeDef = graphql_1.buildSchema(`
  type getColumns {
    _id: ID,
    name: String,
    color: String,
  }
`);
exports.resolvers = {
    getColumns: (parent, args, context, info) => {
        console.log('getColumns', parent, args, context, info);
        console.log(':16', args);
        const res = columns_1.Columns.find({ name: { $in: [args.name] } });
        console.log(':18 res', res);
        return res;
    }
};
const columns = new graphql_1.GraphQLObjectType({
    name: 'columns',
    fields: () => ({
        _id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        color: { type: graphql_1.GraphQLString },
    })
});
// const RocketType = new GraphQLObjectType({
//   name: 'Rocket',
//   fields: () => ({
//     rocket_id: { type: GraphQLString },
//     rocket_name: { type: GraphQLString },
//     rocket_type: { type: GraphQLString }
//   })
// });
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getColumns: {
            type: new graphql_1.GraphQLList(columns),
            args: {
                name: { type: graphql_1.GraphQLString }
            },
            resolve(parent, args) {
                const res = columns_1.Columns.find({ name: new RegExp(args.name, 'i') });
                return res;
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({
    query: RootQuery
});
//# sourceMappingURL=schema.js.map