import server from './config/serverConfig.js';

const PORT = process.env.PORT || 5000;

server.get('/', (req, res) => {
  res.send('SHIELD Password Manager | Om Patil');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
