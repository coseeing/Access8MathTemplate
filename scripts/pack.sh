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
file_to_remove="content-config.json"

zip_file_name="access8math-web-template.zip"

log "Starting script..."

# Remove the file
log "Removing file: $folder_path/$file_to_remove"

rm "$folder_path/$file_to_remove"

# Zip the folder
log "Zipping folder: $folder_path"

zip -rq "$zip_file_name" "$folder_path"

log "Script execution completed."
