const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ---------- Google OAuth ----------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) return done(null, false);

          let user = await User.findOne({ email });
          if (!user) {
            // Create new user with a random password (social login only)
            const crypto = require('crypto');
            const randomPass = crypto.randomBytes(32).toString('hex');
            const bcrypt = require('bcryptjs');
            const hashed = await bcrypt.hash(randomPass, 10);
            user = await User.create({ email, password: hashed, role: 'startup' });
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

module.exports = passport;

