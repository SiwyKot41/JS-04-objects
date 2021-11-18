
const one_kWh_price = 20;
const currentYear = new Date().getFullYear();

class Product {

  constructor(id, name, model, yearOfProduction, price, consumptionOfEnergy_kWh) {
    this.id = id;
    this.name = name;
    this.model = model;
    this.yearOfProduction = yearOfProduction;
    this.price = price;
    this.consumptionOfEnergy_kWh = consumptionOfEnergy_kWh;
  }

  cost() {
    return this.price
  }

  costOfEnergy() {
    return this.consumptionOfEnergy_kWh * one_kWh_price;
  }

  productAge() {
    return currentYear - this.yearOfProduction
  }

  productAgeYears() {
    return this.productAge() === 1 ? this.productAge() + " rok" : this.productAge() + " lata"
  }
}

class ListOfGoods {
    map = {};

    addProduct(product) {
      if (product instanceof Product) {
        if (this.map[product.id] !== undefined) throw "The product with the given id is already on the list"
        else this.map[product.id] = product;
      }
    }

    writeProduct(id) {
      if (this.map[id] !== undefined) console.log(this.map[id].name)
    }

    writeAllProducts() {
      this.map.forEach((value) => {
        console.log(value.name);
      })
    }

    changeProduct(id, product) {
      if (product instanceof Product){
        product.id = id;
        (this.map)[id] = product;
      }
    }
}



