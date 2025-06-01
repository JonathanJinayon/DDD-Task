import { makeSchema, objectType, stringArg, intArg, booleanArg, nonNull } from 'nexus';
import { StoreFruitUseCase } from '../application/use-cases/StoreFruitUseCase';
import { RemoveFruitUseCase } from '../application/use-cases/RemoveFruitUseCase';
import { UpdateFruitUseCase } from '../application/use-cases/UpdateFruitUseCase';
import { DeleteFruitUseCase } from '../application/use-cases/DeleteFruitUseCase';
import { FindFruitUseCase } from '../application/use-cases/FindFruitUseCase';
import { CreateFruitUseCase } from '../application/use-cases/CreateFruitUseCase';

import { FruitRepository } from '../infrastructure/mongoose/FruitRepository';

const fruitRepository = new FruitRepository();

const FruitType = objectType({
  name: 'Fruit',
  definition(t) {
    t.nonNull.string('id');
    t.nonNull.string('name');
    t.nonNull.string('description');
    t.nonNull.int('limitOfFruitToBeStored');
    t.nonNull.int('amountStored');
  },
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('findFruit', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_, { name }) => {
        const useCase = new FindFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name);
        if (!fruit) return null;
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createFruitForFruitStorage', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        const useCase = new CreateFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name, description, limitOfFruitToBeStored);
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });

    t.field('storeFruitToFruitStorage', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve: async (_, { name, amount }) => {
        const useCase = new StoreFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name, amount);
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });

    t.field('removeFruitFromFruitStorage', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
        amount: nonNull(intArg()),
      },
      resolve: async (_, { name, amount }) => {
        const useCase = new RemoveFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name, amount);
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });

    t.field('updateFruitForFruitStorage', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
        description: nonNull(stringArg()),
        limitOfFruitToBeStored: nonNull(intArg()),
      },
      resolve: async (_, { name, description, limitOfFruitToBeStored }) => {
        const useCase = new UpdateFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name, description, limitOfFruitToBeStored);
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });

    t.field('deleteFruitFromFruitStorage', {
      type: FruitType,
      args: {
        name: nonNull(stringArg()),
        forceDelete: nonNull(booleanArg()),
      },
      resolve: async (_, { name, forceDelete }) => {
        const useCase = new DeleteFruitUseCase(fruitRepository);
        const fruit = await useCase.execute(name, forceDelete);
        return {
          id: fruit.id,
          name: fruit.name,
          description: fruit.getDescription(),
          limitOfFruitToBeStored: fruit.getLimit(),
          amountStored: fruit.getAmountStored(),
        };
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, FruitType],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus-typegen.ts',
  },
});
