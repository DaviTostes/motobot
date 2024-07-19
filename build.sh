#!/bin/bash

sudo docker build -t motobot .
sudo docker run --name motobot -d -p 8080:8080 motobot
echo done!
