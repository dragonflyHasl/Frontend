export interface category {
  id: number | undefined;
  nombre: string;
  descripcion: string;
}

export interface usuario {
  id: any;
  correo: string;
  password: string;
  nombre: string;
  rol: string;
  fechaCreacion: Date;
}

export interface singUp {
  name: string;
  email: string;
  password: string;
}

export interface login {
  email: string;
  password: string;
}

export interface product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: undefined | number;
  categoria: category;
  esEcologico: boolean;
  urlImagen: string;
}

export interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}
export interface DetalleOrden {
  id: number | undefined;
  productId: number | undefined;
  producto: product;
  cantidad: number;
  precioUnitario: number;
}
export interface order {
  id: number | undefined;
  usuarioId: any;
  usuario: usuario;
  fechaOrden: Date;
  email: string;
  direccionEnvio: string;
  contacto: string;
  montoTotal: number;
  estado: string;
  detalles: DetalleOrden;
}

export interface cartDetalle {
  id: number | undefined;
  producto: product;
  cantidad: number;
}
export interface cart {
  id: number | undefined;
  idusuario: any;
  productos: cartDetalle[] | undefined;
}
