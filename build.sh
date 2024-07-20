#!/bin/bash

git pull
sudo docker rm -f motobot
sudo docker rmi -f motobot:latest
sudo docker build -t motobot:latest .
sudo docker run --name motobot -d -p 8080:8080 motobot:latest
echo done!
