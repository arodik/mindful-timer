#!/usr/bin/env zsh

# https://github.com/sindresorhus/do-not-disturb/issues/9#issuecomment-768492417
plutil -extract dnd_prefs xml1 -o - /Users/"$USER"/Library/Preferences/com.apple.ncprefs.plist | xmllint --xpath "string(//data)" - | base64 --decode | plutil -convert xml1 - -o - | xmllint --xpath 'boolean(//key[text()="userPref"]/following-sibling::dict/key[text()="enabled"])' -
