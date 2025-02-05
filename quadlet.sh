#!/bin/bash

script=$(realpath -s "$0")
script_dir=$(dirname "${script}")
env_file="${script_dir}/.env"

sudo mkdir -p /etc/containers/systemd/
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.volume | sudo tee /etc/containers/systemd/puzzlemon-db.volume >/dev/null
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.network | sudo tee /etc/containers/systemd/puzzlemon.network >dev/null
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.container | sudo tee /etc/containers/systemd/puzzlemon-db.container >dev/null
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.container | sudo tee /etc/containers/systemd/puzzlemon.container >dev/null

sudo podman build -t puzzlemon-app .
