import os
import subprocess
import datetime
from django.conf import settings


def backup_database():
    db = settings.DATABASES['default']
    db_name = db['NAME']
    db_user = db['USER']
    db_host = db['HOST']
    db_port = db['PORT']

    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    os.makedirs(backup_dir, exist_ok=True)

    timestamp = datetime.datetime.now().strftime('%Y_%m_%d_%H_%M')
    backup_file = os.path.join(backup_dir, f'{db_name}_{timestamp}.sql')

    command = f'pg_dump -U {db_user} -h {db_host} -p {db_port} {db_name} > {backup_file}'

    try:
        subprocess.run(command, shell=True, check=True)
        print(f"Backup successful: {backup_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error during backup: {e}")


def run():
    backup_database()
