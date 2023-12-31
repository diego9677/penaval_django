module.exports = {
    apps: [
        {
            name: 'penaval_django',
            script: '/home/diego/penaval_django/.venv/bin/gunicorn --env DJANGO_SETTINGS_MODULE=config.settings --workers=3 config.wsgi',
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