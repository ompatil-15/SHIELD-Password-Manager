import userRoutes from './user/userRoutes.js';
import passwordRoutes from './password/passwordRoutes.js';
import noteRoutes from './note/noteRoutes.js'
import authRoutes from './auth/authRoutes.js'

const connectRouter = (server) => {
  server.use('/auth', authRoutes)
  server.use('/users', userRoutes);
  server.use('/passwords', passwordRoutes);
  server.use('/notes', noteRoutes);

  return server;
};

export { connectRouter };