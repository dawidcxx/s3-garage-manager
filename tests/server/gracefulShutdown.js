import { promisify } from 'node:util';

/**
 * 
 * @param {import('http').Server} server 
 */
export function gracefulShutdown(server) {
  const closeServerFn = promisify(server.close).bind(server);

  let SHUTTING_DOWN = false;

  function shutdown(details) {
    console.log('Shutdown details:', details);
  
    if (SHUTTING_DOWN) {
      console.warn('Already shutting down. Ignoring additional request.');
      return;
    }
  
    SHUTTING_DOWN = true;
    Promise.race([closeServerFn(), delay(500)])
      .then(() => {
        if (server.listening) {
          console.error('Failed to close server gracefully. Forcing shutdown.');
          process.exit(1);
        } else {
          console.log('Gracefully closed server. Exiting process.');
          process.exit(0);
        }
      })
      .catch((e) => {
        console.error('Failed to close server gracefully. Forcing shutdown.', e);
        process.exit(1);
      });
  }

  return {
    install() { 
      process.on('SIGINT', () => shutdown('SIGINT')); // Handle Ctrl+C
      process.on('SIGTERM', () => shutdown('SIGTERM')); // Handle termination signal
      process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err);
        shutdown('uncaughtException');
      });
      process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        shutdown('unhandledRejection');
      });
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}