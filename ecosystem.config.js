module.exports = {
  apps: [
    {
      name: 'medicalmodels-dev',
      cwd: '/root/medicalmodels',
      script: 'npm',
      args: 'run dev -- -H 0.0.0.0',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '500M',
    },
    {
      name: 'medicalmodels-prod',
      cwd: '/root/medicalmodels',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      watch: false,
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '500M',
    },
  ],
};
