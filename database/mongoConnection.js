const mongoose = require('mongoose');
// Set a Mongoose Promise Library
mongoose.Promise = global.Promise;
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/make-chat-azua`;
mongoose.connect(dbURI, {
  useNewUrlParser: true
});
mongoose.connection.once('open', () => {
  console.log('Database is up!')
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);