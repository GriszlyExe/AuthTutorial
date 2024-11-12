
/**
These Route not require authen
@type {string[]}
*/
export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

/**
These Route require authen
@type {string[]}
*/
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password'
]

/**
These Route require authen
Route that start with this prefix are used for API authentication purpose
@type {string}
*/
export const apiAuthPrefix = '/api/auth';

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'