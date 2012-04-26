@echo off
Rem Change these filenames
set DATABASE="lib\mysql-connector-java-3.0.17-ga-bin.jar"
set COMMONS="lib\commons-codec-1.6.jar"


Rem JSPKE Config
set CONFIG=-Djspkmne.data="jdbc:mysql://localhost/jspkmne?user=fuz&password=fuz"

echo Configured
