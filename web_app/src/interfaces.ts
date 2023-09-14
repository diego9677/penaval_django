interface Base {
  createdAt: string;
  updatedAt: string;
}

export interface Provider extends Base {
  id: number;
  name: string;
  address: string;
}

export interface User extends Base {
  id: number;
  username: string;
  token: string;
  person: Person;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface Product extends Base {
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

export interface Place extends Base {
  id: number;
  name: string;
  description?: string;
  products: ProductShort[];
}

export interface Brand extends Base {
  id: number;
  name: string;
  description?: string;
  products: ProductShort[];
}


export interface Shopping extends Base {
  id: number;
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

export interface Sale extends Base {
  id: number;
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

export interface Client extends Base {
  id: number;
  nit: string;
  person: Person;
}