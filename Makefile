start-server:
	nodemon app.js

heroku:
	git push heroku master

heroku-add-repo:
	git remote add heroku git@heroku.com:ardmostat-landman.git

heroku-setup-development:
	heroku config:add NODE_ENV=development

heroku-setup-production:
	heroku config:add NODE_ENV=production
	heroku config:add HTTPSHost=https://ardmostat-landman.herokuapp.com
