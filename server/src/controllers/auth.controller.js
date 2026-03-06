const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/jwt');

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ username, email, passwordHash: password });
  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
  res.status(201).json({ user: user.toPublic(), accessToken });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
  res.json({ user: user.toPublic(), accessToken });
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = verifyRefresh(token);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = signAccess({ id: user._id });
    res.json({ user: user.toPublic(), accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};