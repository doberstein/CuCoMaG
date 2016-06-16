@echo off

SET CLASSPATH=.
FOR %%f IN ("libs/*.jar") DO CALL add2path.bat libs/%%f

java -mx256m -ms256m info.collide.sqlspaces.server.Server