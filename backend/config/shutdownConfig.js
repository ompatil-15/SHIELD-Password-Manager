const shutdown = () => {
  console.log('Server shutting down');
  process.exit(1);
};

process.on('uncaughtException', err => {
  console.log('[UNCAUGHT EXCEPTION]');
  console.error(err);
  shutdown();
});

process.on('unhandledRejection', err => {
  console.log('[UNHANDLED REJECTION]');
  console.error(err);
  shutdown();
});

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);