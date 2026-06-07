export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  householdName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    householdId: string;
  };
}
