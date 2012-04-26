call config.bat
echo Compiling...
echo.
javac -cp ".;C:\program files\java\jdk1.7.0\jre\lib\plugin.jar;%COMMONS%" -d . *.java
echo Compiled

