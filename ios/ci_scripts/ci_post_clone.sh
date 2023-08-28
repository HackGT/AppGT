 #!/bin/zsh

 # fail if any command fails

 echo "🧩 Stage: Post-clone is activated .... "

 set -e
 # debug log
 set -x

 # Install dependencies using Homebrew. This is MUST! Do not delete.
 #  brew install node cocoapods fastlane
 
 export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
 brew install cocoapods
 # have to add node yourself
 brew install node@16
 # link it to the path
 brew link node@16

 npm install && pod install

 echo "🎯 Stage: Post-clone is done .... "

 exit 0