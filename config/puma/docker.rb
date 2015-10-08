#!/usr/bin/env puma

daemonize false
pidfile 'tmp/pids/puma.pid'
state_path 'tmp/pids/puma.state'
threads 0, 16
tag 'manifold-api'

the_environment = 'development'
bind 'tcp://0.0.0.0:3001'
