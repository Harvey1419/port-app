export interface User {
    usuario: string,
    password: string,
    role: string,
    token: string
}

export type UserLogin = Omit<User, 'role' | 'token'>