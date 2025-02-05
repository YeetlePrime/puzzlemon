#!/bin/bash

script=$(realpath -s "$0")
script_dir=$(dirname "${script}")
env_file="${script_dir}/.env"

target_dir=~/.config/containers/systemd

mkdir -p "${target_dir}"
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.volume >"${target_dir}/puzzlemon-db.volume"
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.network >"${target_dir}/puzzlemon.network"
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon-db.container >"${target_dir}/puzzlemon-db.container"
sed "s|@ENV_FILE@|${env_file}|g" ./quadlets/puzzlemon.container >"${target_dir}/puzzlemon.container"

podman build -t puzzlemon-app .
