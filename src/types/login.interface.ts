//-------------Login interface-------------//
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {

    _id: string;
    username: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    access_token: string;

}
//--------------------------------------------------------------------//