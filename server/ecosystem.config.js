module.exports = {
  apps: [
    {
      name: "speakez-server",
      script: "pnpm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      // Health check
      health_check: {
        enabled: true,
        url: "http://localhost:5000/health",
        interval: 30000,
        timeout: 5000,
        retries: 3,
      },
    },
  ],
};
