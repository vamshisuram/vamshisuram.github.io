#!/bin/bash 
if [[ $# -lt 1 ]]; then 
  echo "No commit message"
else 
  jekyll build
  git add _posts/*
  git add _layouts/*
  git add *.yml
  git add index.html
  git add stylesheets/*
  git add *.sh
  git commit -m "$1"
  git push origin master 
fi
