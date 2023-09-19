module.exports = {
    apps: [
      {
        name: 'penaval_django',
        script: '/home/diego/penaval_django/.env/bin/gunicorn --env DJANGO_SETTINGS_MODULE=config.settings config.wsgi',
        cron_restart: '0'
      }
    ]
  };