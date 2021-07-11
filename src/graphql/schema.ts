import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql';
import purchaseGraphQLType from './purchaseType';
import Purchase from '../models/purchase';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    purchase: {
      type: purchaseGraphQLType,
      args: { id: { type: GraphQLString }},
      resolve(parent, args) {
        return Purchase.findById(args.id)
      }
    },
    purchases: {
      type: new GraphQLList(purchaseGraphQLType),
      resolve(parent, args) {
        return Purchase.find()
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery
});