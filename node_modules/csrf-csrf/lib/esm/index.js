import { createHash, randomBytes } from "crypto";
import createHttpError from "http-errors";
export function doubleCsrf({ getSecret, cookieName = "__Host-psifi.x-csrf-token", cookieOptions: { sameSite = "lax", path = "/", secure = true, ...remainingCOokieOptions } = {}, size = 64, ignoredMethods = ["GET", "HEAD", "OPTIONS"], getTokenFromRequest = (req) => req.headers["x-csrf-token"], }) {
    const ignoredMethodsSet = new Set(ignoredMethods);
    const cookieOptions = {
        sameSite,
        path,
        secure,
        ...remainingCOokieOptions,
    };
    const invalidCsrfTokenError = createHttpError(403, "invalid csrf token", {
        code: "EBADCSRFTOKEN",
    });
    const generateTokenAndHash = (req, overwrite = false) => {
        const csrfCookie = getCsrfCookieFromRequest(req);
        if (typeof csrfCookie === "string" && !overwrite) {
            const [csrfToken, csrfTokenHash] = csrfCookie.split("|");
            const csrfSecret = getSecret(req);
            if (!validateTokenAndHashPair(csrfToken, csrfTokenHash, csrfSecret)) {
                throw invalidCsrfTokenError;
            }
            return { csrfToken, csrfTokenHash };
        }
        const csrfToken = randomBytes(size).toString("hex");
        const secret = getSecret(req);
        const csrfTokenHash = createHash("sha256")
            .update(`${csrfToken}${secret}`)
            .digest("hex");
        return { csrfToken, csrfTokenHash };
    };
    const generateToken = (req, res, overwrite) => {
        const { csrfToken, csrfTokenHash } = generateTokenAndHash(req, overwrite);
        const cookieContent = `${csrfToken}|${csrfTokenHash}`;
        res.cookie(cookieName, cookieContent, { ...cookieOptions, httpOnly: true });
        return csrfToken;
    };
    const getCsrfCookieFromRequest = remainingCOokieOptions.signed
        ? (req) => req.signedCookies[cookieName]
        : (req) => req.cookies[cookieName];
    const validateTokenAndHashPair = (token, hash, secret) => {
        if (typeof token !== "string" || typeof hash !== "string")
            return false;
        const expectedHash = createHash("sha256")
            .update(`${token}${secret}`)
            .digest("hex");
        return expectedHash === hash;
    };
    const validateRequest = (req) => {
        const csrfCookie = getCsrfCookieFromRequest(req);
        if (typeof csrfCookie !== "string")
            return false;
        const [csrfToken, csrfTokenHash] = csrfCookie.split("|");
        const csrfTokenFromRequest = getTokenFromRequest(req);
        const csrfSecret = getSecret(req);
        return (csrfToken === csrfTokenFromRequest &&
            validateTokenAndHashPair(csrfTokenFromRequest, csrfTokenHash, csrfSecret));
    };
    const doubleCsrfProtection = (req, res, next) => {
        req.csrfToken = (overwrite) => generateToken(req, res, overwrite);
        if (ignoredMethodsSet.has(req.method)) {
            next();
        }
        else if (validateRequest(req)) {
            next();
        }
        else {
            next(invalidCsrfTokenError);
        }
    };
    return {
        invalidCsrfTokenError,
        generateToken,
        validateRequest,
        doubleCsrfProtection,
    };
}
