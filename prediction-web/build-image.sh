docker build . --tag fiwareusr/$1:$2
docker push fiwareusr/$1:$2
docker tag fiwareusr/$1:$2 fiwareusr/$1:latest
docker push fiwareusr/$1:latest