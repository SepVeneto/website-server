import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLID, buildSchema } from 'graphql';
import {Columns, ColumnsDocument } from './models/columns';
import { response } from './utils';

export const typeDef = buildSchema(`
  type getColumns {
    _id: ID,
    name: String,
  }
`)

export const resolvers = {
  getColumns: (parent: any, args: any, context: any, info: any) => {
    console.log(parent, args, context, info)
    const res = Columns.find({})
    return res;
  }
}


const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
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
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return Columns.find({});
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery
});