const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const slotRouter = require('./routes/slotRouter');
const bookingRouter = require('./routes/bookingRouter');
const tokenRouter = require('./routes/tokenRouter');
const authRouter = require('./routes/authRouter');
const path = require('path');


const passwordRouter = require('./routes/passwordRouter');

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/tokens', tokenRouter);
app.use('/api/slots', slotRouter);
app.use('/api/bookings', bookingRouter);

app.use('/api/password', passwordRouter);

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

module.exports = app;
