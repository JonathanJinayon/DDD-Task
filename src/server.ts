import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { schema } from './graphql/schema';  // your Nexus schema

async function startServer() {
  // Explicitly type 'app' as Application here:
  const app: Application = express();

  await mongoose.connect('mongodb://localhost:27017/fruitstorage');

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  // No more type error here because app is Application
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();
