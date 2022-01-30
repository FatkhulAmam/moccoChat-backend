# Mocco Chat BE - guide
This is repo for mocco chat backend, where is the application develop with javascript language, express js from node.js framework, and database with sql orm

## step to run:
- clone repo
- add .env file in root project
- add:
- - APP_PORT = 5050
- - APP_KEY = "7H!5!5PR!V473K3Y" 
- yarn install
- make sure you have sql web server(xampp or etc), and run
- sequelize generate model `npx sequelize-cli model:generate --name table_name --attributes column_name:data_type`
- migrate model, run command `npx sequelize-cli db:migrate`