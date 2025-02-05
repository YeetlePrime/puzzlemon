#!/bin/bash

script=$(realpath -s "$0")
script_dir=$(dirname "${script}")
env_file="${script_dir}/.env"

sudo mkdir -p /etc/containers/systemd/
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.volume | sudo tee /etc/containers/systemd/puzzlemon-db.volume
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.network | sudo tee /etc/containers/systemd/puzzlemon.network
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.container | sudo tee /etc/containers/systemd/puzzlemon-db.container
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.container | sudo tee /etc/containers/systemd/puzzlemon.container
