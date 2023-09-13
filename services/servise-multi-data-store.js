const MultiDataStore = require("../models/multi-data-store");

const addNameCustomerToDB = async (nameCustomer) => {
  try {
    const multiDataStore = await MultiDataStore.findOne({});
    if (!multiDataStore) {
      await MultiDataStore.create({ customer: [] });
      await MultiDataStore.updateOne(
        {},
        { $addToSet: { customer: { $each: nameCustomer } } }
      );
    } else {
      await MultiDataStore.updateOne(
        {},
        { $addToSet: { customer: { $each: nameCustomer } } }
      );
    }
    console.log('Назви замовників успішно додано');
  } catch (error) {
    console.log('Помилка додавання замовників: ', error.message);
  }
};

module.exports = {
  addNameCustomerToDB,
};
