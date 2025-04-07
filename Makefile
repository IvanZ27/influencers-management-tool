install:
	npm install
	npm install --prefix client
	npm install --prefix server

dev:
	cd server && npm run dev &
	cd client && npm run dev

dev-all: install dev

up:
	docker compose up --build

down:
	docker compose down

clean:
	docker compose down -v --remove-orphans

prettier:
	npx prettier . --write

fix-css:
	cd client && npx stylelint "src/**/*.css" --fix

pretty: prettier fix-css
