module.exports = {
    apps: [
        {
            name: 'penaval_django',
            script: '/home/diego/penaval_django/.env/bin/gunicorn --env DJANGO_SETTINGS_MODULE=/home/diego/penaval_django/config.settings /home/diego/penaval_django/config.wsgi',
            cron_restart: '0',
            merge_logs: true,
            autorestart: false,
            log_file: "logs/combined.outerr.log",
            out_file: "logs/out.log",
            error_file: "logs/err.log",
            log_date_format: "YYYY-MM-DD HH:mm Z",
            append_env_to_name: true,
            watch: false,
            max_memory_restart: '5G',
        }
    ]
};