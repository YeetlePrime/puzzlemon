#!/bin/sh

title="puzzlemon"

db_name="${title}-db"
db_volume="${db_name}-volume"
app_name="${title}-app"
network_name="${title}-network"

export $(cat .env | xargs)

# create network
if ! podman network exists "${network_name}"; then
	podman network create "${network_name}" 1>/dev/null
	echo "created new network \"${network_name}\"."
else
	echo "network \"${network_name}\" already exists."
fi

# create volume
if ! podman volume exists "${db_volume}"; then
	podman volume create "${db_volume}" 1>/dev/null
	echo "created new volume \"${db_volume}\"."
else
	echo "volume \"${db_volume}\" already exists."
fi

# start db container
echo "starting container \"${db_name}\"."
podman run -d --name "${db_name}" \
	--network "${network_name}" \
	--replace \
	--restart=always \
	-v "${db_volume}":/var/lib/postgresql/data \
	-e TZ="${TIMEZONE}" \
	-e POSTGRES_USER="${DB_USER}" \
	-e POSTGRES_PASSWORD="${DB_PASSWORD}" \
	-e POSTGRES_DB="${DB_DATABASE}" \
	-p "${DB_PORT}:${DB_PORT}" \
	docker.io/library/postgres:latest 1>/dev/null
echo "started container \"${db_name}\"."

# build app image
echo "building image \"${app_name}\"."
podman build -t "${app_name}" .
echo "built image \"${app_name}\"."

# start app contaienr
echo "starting container \"${app_name}\"."
podman run -d --name "${app_name}" \
	--network "${network_name}" \
	--replace \
	--restart=always \
	--env-file .env \
	-e DB_HOST="${db_name}" \
	-e DATABASE_URL="postgres://${DB_USER}:${DB_PASSWORD}@${db_name}:${DB_PORT}/${DB_DATABASE}" \
	"${app_name}" 1>/dev/null
echo "started container \"${app_name}\"."
