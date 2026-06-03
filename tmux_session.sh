#!/bin/bash                                                                                                   

SESSION="gun_store"
tmux has-session -t $SESSION &> /dev/null

if [ $? != 0 ]
then
    tmux new-session -s $SESSION -n shell -d

    tmux new-window -t $SESSION -n server -c backend
    tmux split-window -h -t $SESSION -c frontend

    tmux new-window -t $SESSION -n claude

    tmux new-window -t $SESSION -n docker
fi

tmux attach -t $SESSION
