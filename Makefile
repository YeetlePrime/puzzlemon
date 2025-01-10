up:
	docker-compose up --build
restart:
	docker-compose down
	docker-compose up --build
up-db:
	docker-compose up db
restart-db:
	docker-compose down db
	docker-compose up db

