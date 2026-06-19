export const options = {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'strict',
    maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE) 
}