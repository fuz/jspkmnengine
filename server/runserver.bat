call config.bat

@echo on
java %CONFIG% -cp ".;C:\program files\java\jdk1.7.0\jre\lib\plugin.jar;%COMMONS%;%DATABASE%" jspkmne.server.JSPKEServer
