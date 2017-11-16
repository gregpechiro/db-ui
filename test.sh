#!/usr/bin/env bash
sed -e 's/\"//g' $1 | grep -n -e $2 | awk -F: '{printf $1 ","}'
