/**
 * PM2 ecosystem config for FIECON
 * Used on the production server to run the Next.js app
 */
module.exports = {
  apps: [
    {
      name: "fiecon",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/fiecon",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "500M",
      error_file: "/var/log/pm2/fiecon-error.log",
      out_file: "/var/log/pm2/fiecon-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
