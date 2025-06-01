import { graphql } from 'graphql';
import { schema } from '../../graphql/schema';
import mongoose from 'mongoose';
import { FruitModel } from '../../infrastructure/mongoose/FruitModel';

interface CreateFruitResponse {
  createFruitForFruitStorage: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
  };
}

interface UpdateFruitResponse {
  updateFruitForFruitStorage: {
    name: string;
    description: string;
  };
}

interface DeleteFruitResponse {
  deleteFruitFromFruitStorage: {
    success: boolean;
  };
}

interface StoreFruitResponse {
  storeFruitToFruitStorage: {
    name: string;
    amountStored: number;
  };
}

interface RemoveFruitResponse {
  removeFruitFromFruitStorage: {
    name: string;
    amountStored: number;
  };
}

interface FindFruitResponse {
  findFruit: {
    name: string;
    description: string;
    limitOfFruitToBeStored: number;
    amountStored: number;
  };
}

async function runMutation<T = any>(mutation: string, variables: any = {}) {
  return graphql({
    schema,
    source: mutation,
    variableValues: variables,
  }) as Promise<{ data?: T; errors?: any }>;
}

async function runQuery<T = any>(query: string, variables: any = {}) {
  return graphql({
    schema,
    source: query,
    variableValues: variables,
  }) as Promise<{ data?: T; errors?: any }>;
}

describe('Fruit Storage System Acceptance Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/fruit_storage_test');
  });

  beforeEach(async () => {
    await FruitModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  async function seedLemon(amountStored = 0) {
    const createMutation = `
      mutation CreateFruit($name: String!, $description: String!, $limit: Int!) {
        createFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limit) {
          name
          description
          limitOfFruitToBeStored
        }
      }
    `;

    const storeMutation = `
      mutation StoreFruit($name: String!, $amount: Int!) {
        storeFruitToFruitStorage(name: $name, amount: $amount) {
          name
          amountStored
        }
      }
    `;

    await runMutation(createMutation, {
      name: 'lemon',
      description: 'this is a lemon',
      limit: 10,
    });

    if (amountStored > 0) {
      await runMutation(storeMutation, {
        name: 'lemon',
        amount: amountStored,
      });
    }
  }

  test('createFruitForFruitStorage: create lemon successfully', async () => {
    const mutation = `
      mutation CreateFruit($name: String!, $description: String!, $limit: Int!) {
        createFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limit) {
          name
          description
          limitOfFruitToBeStored
        }
      }
    `;

    const result = await runMutation<CreateFruitResponse>(mutation, {
      name: 'lemon',
      description: 'this is a lemon',
      limit: 10,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.createFruitForFruitStorage.name).toBe('lemon');
  });

  test('createFruitForFruitStorage: too long description should fail', async () => {
    const mutation = `
      mutation CreateFruit($name: String!, $description: String!, $limit: Int!) {
        createFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limit) {
          name
        }
      }
    `;

    const result = await runMutation(mutation, {
      name: 'lemon',
      description: 'x'.repeat(40),
      limit: 10,
    });

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/description must be at most 30 characters/i);
  });

  test('createFruitForFruitStorage: duplicate should fail', async () => {
    await seedLemon();
    const mutation = `
      mutation {
        createFruitForFruitStorage(name: "lemon", description: "this is a lemon", limitOfFruitToBeStored: 10) {
          name
        }
      }
    `;

    const result = await runMutation(mutation);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/already exists/i);
  });

  test('updateFruitForFruitStorage: update description successfully', async () => {
    await seedLemon();

    const mutation = `
    mutation UpdateFruit($name: String!, $description: String!, $limit: Int!) {
        updateFruitForFruitStorage(name: $name, description: $description, limitOfFruitToBeStored: $limit) {
        name
        description
        }
    }
    `;

    const result = await runMutation<UpdateFruitResponse>(mutation, {
    name: 'lemon',
    description: 'updated',
    limit: 10,  // match the existing limit or whatever is appropriate
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.updateFruitForFruitStorage.description).toBe('updated');
  });

    test('deleteFruitFromFruitStorage: fail without force when in storage', async () => {
    await seedLemon(5);

    const mutation = `
        mutation {
        deleteFruitFromFruitStorage(name: "lemon", forceDelete: false) {
            name
        }
        }
    `;

    const result = await runMutation(mutation);

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/stored amount.*forceDelete is true/i);
    });

    test('deleteFruitFromFruitStorage: force delete with storage', async () => {
    await seedLemon(5);

    const mutation = `
        mutation {
        deleteFruitFromFruitStorage(name: "lemon", forceDelete: true) {
            name
        }
        }
    `;

    const result = await runMutation(mutation);

    expect(result.errors).toBeUndefined();
    expect(result.data?.deleteFruitFromFruitStorage.name).toBe("lemon");
    });


  test('storeFruitToFruitStorage: store under limit', async () => {
    await seedLemon(0);

    const mutation = `
      mutation {
        storeFruitToFruitStorage(name: "lemon", amount: 5) {
          name
          amountStored
        }
      }
    `;

    const result = await runMutation<StoreFruitResponse>(mutation);
    expect(result.errors).toBeUndefined();
    expect(result.data?.storeFruitToFruitStorage.amountStored).toBe(5);
  });

  test('storeFruitToFruitStorage: exceed limit should fail', async () => {
    await seedLemon(0);

    const mutation = `
        mutation {
        storeFruitToFruitStorage(name: "lemon", amount: 11) {
            name
            amountStored
        }
        }
    `;

    const result = await runMutation(mutation);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/exceeds the storage limit/i);
    });


  test('removeFruitFromFruitStorage: remove within amount', async () => {
    await seedLemon(5);

    const mutation = `
      mutation {
        removeFruitFromFruitStorage(name: "lemon", amount: 5) {
          name
          amountStored
        }
      }
    `;

    const result = await runMutation<RemoveFruitResponse>(mutation);
    expect(result.errors).toBeUndefined();
    expect(result.data?.removeFruitFromFruitStorage.amountStored).toBe(0);
  });

  test('removeFruitFromFruitStorage: remove more than stored should fail', async () => {
    await seedLemon(5);

    const mutation = `
      mutation {
        removeFruitFromFruitStorage(name: "lemon", amount: 6) {
          name
          amountStored
        }
      }
    `;

    const result = await runMutation(mutation);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/not enough fruit stored.*requested amount/i);
  });

  test('findFruit: successful', async () => {
    await seedLemon(5);

    const query = `
      query {
        findFruit(name: "lemon") {
          name
          description
          limitOfFruitToBeStored
          amountStored
        }
      }
    `;

    const result = await runQuery<FindFruitResponse>(query);
    expect(result.errors).toBeUndefined();
    expect(result.data?.findFruit.name).toBe('lemon');
  });

    test('findFruit: not found', async () => {
    const query = `
        query {
        findFruit(name: "nonexistent") {
            name
        }
        }
    `;

    const result = await runQuery(query);

    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].message).toMatch(/fruit not found/i);
    });
});
