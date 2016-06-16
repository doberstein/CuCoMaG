#!/bin/sh

if [ -d libs ]
then
	export CLASSPATH=
	for i in `ls libs/*.jar`; do
		export CLASSPATH=$i:$CLASSPATH
	done
	java  -mx256m -ms256m info.collide.sqlspaces.server.Server
else
	echo "No libs-dir found!"	
fi