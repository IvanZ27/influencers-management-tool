install:
	npm install
	npm install --prefix client
	npm install --prefix server

up:
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down -v --remove-orphans

pretty:
	npx prettier . --write