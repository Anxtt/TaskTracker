export interface IdentityResponseModel {
    userName: string;
    id: string,
    accessToken: string;
    refreshToken: string;
    roles: string[];
}