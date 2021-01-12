export interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface IToken {
  readonly token: string;
}
