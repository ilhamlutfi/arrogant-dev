import Tokens from 'csrf';
const tokens = new Tokens();

/**
 * Middleware untuk menghasilkan CSRF token
 */
export const generateCsrfToken = (req, res, next) => {
    let secret = req.cookies['csrf-secret'];

    // Buat secret baru jika belum ada
    if (!secret) {
        secret = tokens.secretSync();
        res.cookie('csrf-secret', secret, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict'
        });
    }

    // Buat token berdasarkan secret
    res.locals.csrfToken = tokens.create(secret);

    next();
};

/**
 * Middleware untuk memverifikasi CSRF token
 */
export const verifyCsrfToken = (req, res, next) => {
    const secret = req.cookies['csrf-secret']; // Ambil secret dari cookie
    const token = req.body._csrf || req.query._csrf || req.headers['x-csrf-token'];

    if (!secret || !token || !tokens.verify(secret, token)) {
        return res.status(403).send('<h1>Invalid CSRF token</h1>');
    }

    next();
};
