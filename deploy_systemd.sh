#!/bin/bash

script=$(realpath -s "$0")
script_dir=$(dirname "${script}")
env_file="${script_dir}/.env"
container_file="${script_dir}/Containerfile"

# set target directory for the quadlet files
if [ -z "${XDG_CONFIG_HOME}" ]; then
	target_dir="${HOME}/.config/containers/systemd"
else
	target_dir="${XDG_CONFIG_HOME}/containers/systemd"
fi

replace_and_copy() {
	file=$1
	file_name=$(basename "${file}")
	file_target="${target_dir}/${file_name}"

	sed -e "s|@ENV_FILE@|${env_file}|g" \
		-e "s|@CONTAINER_FILE@|${container_file}|g" \
		"${file}" >"${file_target}"

	echo "${file} --> ${file_target}"
}

mkdir -p "${target_dir}"
for file in "${script_dir}/quadlets/"*; do
	replace_and_copy "${file}"
done
