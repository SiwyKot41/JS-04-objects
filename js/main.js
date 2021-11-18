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
    if (this.productAge() === 1) return this.productAge() + " rok"
    else if (this.productAge() > 1 && this.productAge() < 5) return this.productAge() + " lata"
    else if (this.productAge() >= 5 || this.productAge() === 0) return this.productAge() + " lat";
    return "Ten produkt jeszcze nie został wyprodukowany :/"
  }

  clone() {
    return new Product(this.id, this.name, this.model, this.yearOfProduction, this.price, this.consumptionOfEnergy_kWh)
  }
}

class ListOfGoods {
  map = new Map;

  addProduct(product) {
    if (product instanceof Product) {
      if (this.map.get(product.id) !== undefined) throw "The product with the given id is already on the list"
      else this.map.set(product.id,product)
    }
  }

  writeProduct(id) {
    if (this.map.get(id) !== undefined) console.log("Produkt: " + this.map.get(id).name)
  }

  writeAllProducts() {
    this.map.forEach((value) => {
      console.log("Id: " + value.id + " Produkt: " + value.name);
    })
  }

  changeProduct(id, product) {
    if (product instanceof Product) {
      product.id = id;
      this.map.set(id, product);
    }
  }
}

class Inventory extends ListOfGoods {
  constructor() {
    super();
  }

  addProduct(product, amount) {
    let productStock = {
      product: product,
      amount: amount
    }

    if (this.map.get(product.id) !== undefined) throw "The product with the given id is already on the list"
    else this.map.set(product.id, productStock)
  }

  writeProduct(id) {
    if (this.map.get(id) !== undefined) console.log("Produkt: " + this.map.get(id).product.name + " Ilość:" + this.map.get(id).amount)
  }

  writeAllProducts() {
    this.map.forEach((value) => {
      console.log("Produkt: " + value.product.name + " Ilość: " + value.amount);
    })
  }

  changeProduct(id, product, amount) {
    if (product instanceof Product) {
      product.id = id;
      let productStock = {
        product: product,
        amount: amount
      }

      this.map.set(id, productStock);
    }
  }

  hasTheProduct(id) {
    if (this.map.has(id)) return this.map.get(id).amount
    else return 0;
  }

  removeTheProduct(id, amount) {
    let p = this.map.get(id).product.clone()
    if (this.map.get(id).amount <= amount) this.map.delete(id)
    else {
      let productStock = {
        product: this.map.get(id).product,
        amount: this.map.get(id).amount - amount
      }

      this.map.set(id, productStock)
    }

    return p;
  }
}

class Shop extends ListOfGoods {
  uuid = 0;
  id;
  set = new Set
  constructor() {
    super();
  }

  addProduct2(name, model, yearOfProduction, price, consumptionOfEnergy_kWh) {
    do {
      this.id = this.uuid
    } while (this.set.has(this.uuid++))

    this.set.add(this.uuid - 1)
    let product = new Product(this.id, name, model, yearOfProduction, price, consumptionOfEnergy_kWh);
    this.map.set(product.id, product)
  }

  addProduct(id, name, model, yearOfProduction, price, consumptionOfEnergy_kWh) {
    if (!this.set.has(id)) this.set.add(id)
    let product = new Product(id, name, model, yearOfProduction, price, consumptionOfEnergy_kWh);
    if (this.map.get(product.id) !== undefined) throw "The product with the given id is already on the list"
    else this.map.set(product.id, product)
  }


}

class Order {
  orderId = 0;
  map = new Map;


  addProduct(id, inventory, amount) {
    let amountOfProduct = inventory.hasTheProduct(id)
    if (amountOfProduct !== 0) {
      if (amount > amountOfProduct) amount = amountOfProduct
      let order = {
        id: id,
        inventory: inventory,
        amount: amount
      }

      this.map.set(this.orderId++, order)
    } else throw "W tym magazynie nie ma tego produktu!"
  }

  completeTheOrder() {
    this.map.forEach((value) => {
      console.log("Otrzymujesz produkt zgodnie z zamówieniem " + value.inventory.removeTheProduct(value.id, value.amount).name)
    })
  }
}

let product = new Product(1, "Pianino", "YAMAHA PZ-BVB09", "1909", 20130424, 0)
let product2 = new Product(2, "Gitara", "FENDER SW-ZSO66", "2005", 195109, 25)
let product3 = new Product(3, "Perkusja", "MAPEX-PROM", "2015", 28092000, 0)
let product4 = new Product(4, "Dron", "K-STCH0902", "2014", 105, 5)

console.log(product.productAgeYears())
console.log(product.cost())
console.log(product.costOfEnergy())
console.log(product.productAge())
console.log("------------------")

let listOfGoods = new ListOfGoods()
listOfGoods.addProduct(product)
listOfGoods.addProduct(product2)
listOfGoods.addProduct(product4)
listOfGoods.writeProduct(1)
listOfGoods.writeProduct(2)
listOfGoods.changeProduct(2, product3)
listOfGoods.writeProduct(1)
listOfGoods.writeProduct(2)
listOfGoods.writeAllProducts()

console.log("------------------")
let inventory = new Inventory()
inventory.addProduct(product, 3)
inventory.addProduct(product2, 20)
inventory.writeProduct(1)
inventory.writeProduct(2)
inventory.changeProduct(1, product3, 50)
inventory.writeAllProducts()

console.log("------------------")
let ord = new Order()
console.log("-----")
ord.addProduct(1, inventory,2)
ord.addProduct(2, inventory, 12)
ord.completeTheOrder()
inventory.writeProduct(1)
inventory.writeProduct(2)

console.log("------------------")
let shop = new Shop()
shop.addProduct(1, "Pianino", "YAMAHA PZ-BVB09", "1909", 20130424, 0)
shop.addProduct2("Gitara", "FENDER SW-ZSO66", "2005", 195109, 25)
shop.addProduct(2, "Perkusja", "MAPEX-PROM", "2015", 28092000, 0)
shop.addProduct2("Dron", "K-STCH0902", "2014", 105, 5)
shop.writeAllProducts()

