export interface User {
  _id: string;
  nombreCompleto: string;
  email: string;
  edad?: number;
  activo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

// ESTA INTERFAZ FALTABA O NO ESTABA EXPORTADA
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}