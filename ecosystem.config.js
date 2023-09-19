module.exports = {
    apps: [
      {
        name: 'penaval_django',
        script: '/home/diego/penaval_django/.env/bin/gunicorn /home/diego/penaval_django/config.wsgi',
        cron_restart: '* * * * *'
      }
    ]
  };