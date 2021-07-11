import { GraphQLObjectType } from 'graphql';
import purchaseGraphQLType from './purchaseType';
import Gadget from './../models/purchase';

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  }
})

export default Mutation;