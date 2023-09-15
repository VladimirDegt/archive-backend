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
    console.log("Назви замовників успішно додано");
  } catch (error) {
    console.log("Помилка додавання замовників: ", error.message);
  }
};

const addNumberToDB = async (number) => {
  try {
    const multiDataStore = await MultiDataStore.findOne({});
    if (!multiDataStore) {
      await MultiDataStore.create({ numberDogovir: [] });
      await MultiDataStore.updateOne(
        {},
        { $addToSet: { numberDogovir: number } }
      );
    } else {
      await MultiDataStore.updateOne(
        {},
        { $addToSet: { numberDogovir: number } }
      );
    }
    console.log("Номер договору успішно додано");
  } catch (error) {
    console.log("Помилка додавання номеру договору: ", error.message);
  }
};

const getNameCustomerToDB = async () => {

  try {
    const getNames = await MultiDataStore.findOne({
      customer: { $exists: true },
    });
    console.log("Назви замовників та номерів успішно знайдено");
    return ({
      allNames: getNames.customer.sort(),
      allNumbers: getNames.numberDogovir.sort(),
    });
  } catch (error) {
    console.log("Помилка узяти всіх замовників: ", error.message);
  }
};

module.exports = {
  addNameCustomerToDB,
  getNameCustomerToDB,
  addNumberToDB,
};
