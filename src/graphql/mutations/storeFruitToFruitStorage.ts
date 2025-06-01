import { mutationField, nonNull, stringArg, intArg } from 'nexus'

export const StoreFruitToFruitStorage = mutationField('storeFruitToFruitStorage', {
  type: 'Fruit',
  args: {
    name: nonNull(stringArg()),
    amount: nonNull(intArg()),
  },
  async resolve(_, { name, amount }, { fruitService }) {
    return await fruitService.storeFruit(name, amount)
  },
})
