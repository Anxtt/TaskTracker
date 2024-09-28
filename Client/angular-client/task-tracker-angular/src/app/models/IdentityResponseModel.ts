export interface IdentityResponseModel {
    userName: string;
    accessToken: string;
    refreshToken: string;
    roles: string[];
}