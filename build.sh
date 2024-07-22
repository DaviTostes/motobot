#!/bin/bash

git pull
sudo docker rm -f motobot
sudo docker rmi -f motobot
sudo docker build -t motobot .
sudo docker run --name motobot -d  motobot
sudo docker ps
echo done!
