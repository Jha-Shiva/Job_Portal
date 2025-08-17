import sanitizeHtml from 'sanitize-html';

export default function sanitizeBody(req, res, next) {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key]);
            }
        }
    }
    next();
}