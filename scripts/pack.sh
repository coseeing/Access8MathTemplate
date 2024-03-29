#!/bin/bash

# Log colors
green="\033[0;32m"
reset="\033[0m"

# Log messages
log() {
  echo "${green}[INFO]$(date +" %Y-%m-%d %H:%M:%S"): $1${reset}\n"
}

folder_path="build"

# remove the config file 
config_file_name="content-config.js"

zip_file_name="access8math-web-template.zip"

log "Starting script..."

# Remove the file
log "Removing file: $folder_path/$config_file_name"

rm "$folder_path/$config_file_name"

# Zip the folder
log "Zipping folder: $folder_path"

(cd $folder_path; zip -r "../$zip_file_name" *)

log "Script execution completed."
