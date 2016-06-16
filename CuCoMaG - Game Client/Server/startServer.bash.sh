#!/bin/bash
#######
#
# Somewhat more configurable startscript using bash.
#
#######

# Maximum Heapspace assigned to the SQLSpacesServer
SERVER_MAXHEAPSPACE=1024m

# Initially reserved Heapspace
SERVER_MINHEAPSPACE=256m



SQLSOPTIONS=

for argument in "$@"
do
        if [ "${argument:0:12}" == "serviceport=" ]
        then
                SERVICEPORT="${argument:12}"
                SSLSERVICEPORT="$(($SERVICEPORT+5))"
                SQLSOPTIONS="$SQLSOPTIONS -Dsqlspaces.server.non-ssl.port=$SERVICEPORT -Dsqlspaces.server.ssl.port=$SSLSERVICEPORT"

        elif [ "${argument:0:14}" == "webserverport=" ]
        then
                WEBSERVERPORT=${argument:14}
                SQLSOPTIONS="$SQLSOPTIONS -Dsqlspaces.server.web.port=$WEBSERVERPORT"
        elif [ "${argument:0:7}" == "dbname=" ]
        then
                DATABASENAME="${argument:7}"
                SQLSOPTIONS="$SQLSOPTIONS -Dsqlspaces.db.schema=$DATABASENAME"
        elif [ "${argument:0:6}" == "limit=" ]
        then
                LIMIT="${argument:6}"
                SQLSOPTIONS="$SQLSOPTIONS -Dsqlspaces.db.querylimit=$LIMIT"

        elif [ "${argument:0:4}" == "dump" ]
        then
                JVMOPTIONS="-XX:+HeapDumpOnOutOfMemoryError"

        else
                echo "Argument "$argument" not recognized. IGNORED"
        fi
done

if [ -n "$JVMOPTIONS" ]
then 
	JVMOPTIONS="$JVMOPTIONS -XX:HeapDumpPath=./sqlspacesserver.$DATABASENAME.hprof"
fi

if [ -d libs ]
then
        export CLASSPATH=
        for i in `ls libs/*.jar`; do
                export CLASSPATH=$i:$CLASSPATH
        done
echo Starting Server
echo with maximum HEAPSIZE of $SERVER_MAXHEAPSPACE
if [ -n "$SERVICEPORT" ]
then
        echo "on port $SERVICEPORT"
fi
if [ -n "$DATABASENAME" ]
then
        echo "with schema $DATABASENAME"
fi

        java  -Xmx$SERVER_MAXHEAPSPACE -Xms$SERVER_MINHEAPSPACE  $SQLSOPTIONS $JVMOPTIONS info.collide.sqlspaces.server.Server
else
        echo "No libs-dir found!"
fi
