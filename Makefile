# Change this to edit the podman container/network/volume names
project_prefix := puzzlemon

network := $(project_prefix)-network
db := $(project_prefix)-db
db_volume := $(db)-volume
app := $(project_prefix)-app

# load environment variables from .env file
ifneq (,$(wildcard ./.env))
	include .env
	export
endif


dev:
	docker-compose down
	docker-compose up --build
prod:
	docker-compose -f docker-compose-prod.yaml down
	docker-compose -f docker-compose-prod.yaml up --build
prod-detached:
	docker-compose -f docker-compose-prod.yaml down
	docker-compose -f docker-compose-prod.yaml up --build --detach
prod-logs:
	docker-compose -f docker-compose-prod.yaml logs


db-podman:
	podman network create $(network) || true
	podman volume create $(db_volume) || true
	podman run -d --name $(db) \
		--network $(network) \
		--replace \
		--restart=always \
		-v $(db_volume):/var/lib/postgresql/data \
		-e TZ=$(TIMEZONE) \
		-e POSTGRES_USER=$(DB_USER) \
		-e POSTGRES_PASSWORD=$(DB_PASSWORD) \
		-e POSTGRES_DB=$(DB_DATABASE) \
		-p $(DB_PORT):$(DB_PORT) \
		docker.io/library/postgres:latest

app-podman:
	podman network create $(network) || true
	podman build -t $(app) .
	podman run -d --name $(app) \
		--network $(network) \
		--replace \
		--restart=always \
		--env-file .env \
		-e DB_HOST=$(db) \
		-e DATABASE_URL=postgres://$(DB_USER):$(DB_PASSWORD)@$(db):$(DB_PORT)/$(DB_DATABASE) \
		$(app)

