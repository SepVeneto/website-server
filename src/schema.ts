import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLID, buildSchema, GraphQLScalarType } from 'graphql';
import {Columns, ColumnsDocument } from './models/columns';
import { response } from './utils';

export const typeDef = buildSchema(`
  type getColumns {
    _id: ID,
    name: String,
    color: String,
  }
`)

export const resolvers = {
  getColumns: (parent: any, args: any, context: any, info: any) => {
    console.log('getColumns', parent, args, context, info)
    console.log(':16', args)
    const res = Columns.find({ name: { $in: [args.name]}})
    console.log(':18 res', res)
    return res;
  }
}


const columns = new GraphQLObjectType({
  name: 'columns',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    color: { type: GraphQLString},
    // mission_name: { type: GraphQLString },
    // launch_date_local: { type: GraphQLString },
    // launch_success: { type: GraphQLBoolean },
    // rocket: { type: RocketType },
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

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getColumns: {
      type: new GraphQLList(columns),
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        const res = Columns.find({ name: new RegExp(args.name, 'i')})
        return res;
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});