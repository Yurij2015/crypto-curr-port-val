#!/bin/sh
set -e

if [ "$1" = 'frankenphp' ] || [ "$1" = 'php' ] || [ "$1" = 'bin/console' ]; then
	# Create minimal .env file in production (all vars come from docker-compose env)
	if [ "$APP_ENV" = "prod" ]; then
		echo "APP_ENV=prod" > .env
		echo "APP_RUNTIME_ENV=prod" >> .env
		echo "Created minimal .env file (all other vars from environment)"
	fi

	# Ensure var directories exist with correct permissions before any PHP command
	# Remove symlink if it exists (happens when volumes: [] in compose)
	if [ -L "var" ]; then
		rm -f var
	fi
	mkdir -p var/cache var/log 2>/dev/null || true
	setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var 2>/dev/null || chmod -R 777 var
	setfacl -dR -m u:www-data:rwX -m u:"$(whoami)":rwX var 2>/dev/null || true

	if [ -z "$(ls -A 'vendor/' 2>/dev/null)" ]; then
		composer install --prefer-dist --no-progress --no-interaction
	fi

	# Display information about the current project
	# Or about an error in project initialization
	php bin/console -V

	if grep -q ^DATABASE_URL= .env; then
		echo 'Waiting for database to be ready...'
		ATTEMPTS_LEFT_TO_REACH_DATABASE=60
		until [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ] || DATABASE_ERROR=$(php bin/console dbal:run-sql -q 'SELECT 1' 2>&1); do
			if [ $? -eq 255 ]; then
				# If the Doctrine command exits with 255, an unrecoverable error occurred
				ATTEMPTS_LEFT_TO_REACH_DATABASE=0
				break
			fi
			sleep 1
			ATTEMPTS_LEFT_TO_REACH_DATABASE=$((ATTEMPTS_LEFT_TO_REACH_DATABASE - 1))
			echo "Still waiting for database to be ready... Or maybe the database is not reachable. $ATTEMPTS_LEFT_TO_REACH_DATABASE attempts left."
		done

		if [ $ATTEMPTS_LEFT_TO_REACH_DATABASE -eq 0 ]; then
			echo 'The database is not up or not reachable:'
			echo "$DATABASE_ERROR"
			exit 1
		else
			echo 'The database is now ready and reachable'
		fi

		if [ "$( find ./migrations -iname '*.php' -print -quit )" ]; then
			php bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing
		fi
	fi

	# Install API Platform assets (Swagger UI, etc.)
	php bin/console assets:install public --no-interaction

	echo 'PHP app ready!'
fi

exec docker-php-entrypoint "$@"
