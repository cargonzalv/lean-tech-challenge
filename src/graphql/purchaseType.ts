import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const purchaseType = new GraphQLObjectType({
  name: 'Purchase',
  fields: () => ({
    id: { type: GraphQLString },
    fecha: { type: GraphQLString },
    cantidad: { type: GraphQLInt },
    idProducto: { type: GraphQLInt },
    nombreProducto: { type: GraphQLString },
  })
});

export default purchaseType;