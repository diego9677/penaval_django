
export interface Provider {
  id: number;
  name: string;
  address: string;
}

export interface User {
  id: number;
  username: string;
  email: string
}

export interface Product {
  id: number;
  code: string;
  stock: number;
  pucharse_price: number;
  price: number;
  measures: string;
  place: Place;
  brand: Brand;
}

interface ProductShort {
  id: number,
  code: string,
  stock: number,
  measures: string,
  price: number,
}

export interface Place {
  id: number;
  name: string;
  description?: string;
  products?: ProductShort[];
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  products?: ProductShort[];
}


export interface Shopping {
  id: number;
  date: string;
  provider: Provider;
  shopping_detail: {
    id: number;
    amount: number;
    unit_price_shopping: number;
    unit_price_sale: number;
    product: {
      id: number;
      code: string;
    };
  }[];
}

export interface Sale {
  id: number;
  date: string;
  client: Client;
  sale_detail: {
    id: number;
    amount: number;
    unit_price: number;
    subtotal: number;
    product: {
      id: number;
      code: string;
    };
  }[];
}

// shopping form
export interface ShoppingCart {
  product_code: string;
  product_id: number;
  amount: number;
  pucharse_price: number;
  sale_price: number;
}


export interface SaleCart {
  product_code: string;
  product_id: number;
  amount: number;
  unit_price: number;
}

export interface ParamsReport {
  begin: string | null;
  end: string | null;
}

export interface Client {
  id: number;
  nit: string;
  first_name: string;
  last_name: string;
  phone: string;
}