# Todos os lugares onde tem hello é o nome da funcao

# Instalar
npm install -g serverless

# SLS inicializar
sls

# Sempre fazer o deploy apos criar o projeto, sempre que tiver uma alteracao fazer deploy
sls deploy

# Invocar a funcao AWS
sls invoke -f hello

# Invocar a funcao local
sls invoke -f hello -l

#configurar dashboard
sls

#logs 
sls logs -f hello -t

#remover
sls remove
