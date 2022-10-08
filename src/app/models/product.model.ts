export interface Category {
  id:string;
  name:string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  taxes?:number;
}
//Omit nos permite extender de product y omitir el id y la categoria en cambio agregamos categoryId
export interface CreateProductDTO extends Omit<Product,'id' | 'category'>{
  categoryId: number;
}
//Partial automaticamete agrega ? a los atributos de la interfaz permitiendome extender de createProduct
export interface UpdateProductDTO extends Partial<CreateProductDTO>{}
