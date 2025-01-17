dev:
	docker-compose down
	docker-compose up --build
prod:
	docker-compose -f docker-compose-prod.yaml down
	docker-compose -f docker-compose-prod.yaml up --build
prod-detached:
	docker-compose -f docker-compose-prod.yaml down
	docker-compose -f docker-compose-prod.yaml up --build
prod-logs:
	docker-compose -f docker-compose-prod.yaml logs
