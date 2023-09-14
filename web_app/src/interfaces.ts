
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

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Product {
  id: number;
  code: string;
  stock: number;
  pucharsePrice: number;
  price: number;
  measures: string;
  place: {
    id: number;
    name: string;
  };
  brand: {
    id: number;
    name: string;
  };
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
  products: ProductShort[];
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  products: ProductShort[];
}


export interface Shopping {
  id: number;
  date: string;
  provider: {
    id: number;
    name: string;
  };
  shoppingDetail: {
    id: number;
    quantity: number;
    pucharsePrice: number;
    salePrice: number;
    product: {
      id: number;
      code: string;
    };
  }[];
}

export interface Sale {
  id: number;
  date: string;
  client: {
    id: number;
    nit: string;
    person: Person;
  };
  saleDetail: {
    id: number;
    quantity: number;
    salePrice: number;
    product: {
      id: number;
      code: string;
    };
  }[];
}

// shopping form
export interface ShoppingCart {
  productCode: string;
  productId: number;
  quantity: number;
  pucharsePrice: number;
  salePrice: number;
}


export interface SaleCart {
  productCode: string;
  productId: number;
  quantity: number;
  salePrice: number;
}

export interface ParamsReport {
  begin: string | null;
  end: string | null;
}

export interface Client {
  id: number;
  nit: string;
  person: Person;
}