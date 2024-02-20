# 1 - Criar arquivo de seguranca
#  - Configuracoes sobre a seguranca da lambda e seus acessos

# 2 - Criar role de seguranca na AWS usando IAM

aws iam create-role \
    --role-name lambda-exemplo \
    --assume-role-policy-document file://politicas.json \
    | tee logs/role.log


# Criar arquivo index.js e zipar ele
zip function.zip index.js


# Agora criamos a funcation lambda e enviamos o zip
aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs18.x \
    --role arn:aws:iam::671529718246:role/lambda-exemplo \
    | tee logs/lambda-create.log

# Agora vamos simular a lambda inkando um evento
# invoke lambda
aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-exec.log


# atualizar a lambda e enviar novamente
zip function.zip index.js

# atualizar a lambda
aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log

# Remove function(Lambda) e a IAM (Role)
aws lambda delete-function --function-name hello-cli

aws iam delete-role --role-name lambda-exemplo
