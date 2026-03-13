const https = require('https');

/**
 * Middleware to verify Google reCAPTCHA token.
 * If RECAPTCHA_SECRET_KEY is not set, the middleware passes through (dev mode).
 */
module.exports = (req, res, next) => {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    // reCAPTCHA not configured – skip verification
    return next();
  }

  const token = req.body.recaptchaToken;
  if (!token) {
    return res.status(400).json({ message: 'reCAPTCHA token is required' });
  }

  const postData = `secret=${encodeURIComponent(process.env.RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(token)}`;

  const options = {
    hostname: 'www.google.com',
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => (data += chunk));
    response.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          next();
        } else {
          res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }
      } catch {
        res.status(500).json({ message: 'reCAPTCHA verification error' });
      }
    });
  });

  request.on('error', () => {
    res.status(500).json({ message: 'reCAPTCHA verification error' });
  });

  request.write(postData);
  request.end();
};
