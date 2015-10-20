# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'manifold_api'
set :repo_url, 'git@github.com:ManifoldScholar/manifold-api.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, '/home/manifold_api/manifold_api'

# Default value for :scm is :git
set :scm, :git

# Default value for :format is :pretty
set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
# set :pty, true


set :linked_dirs, %w{log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/uploads}
set :linked_files, ["config/secrets.yml"]

set :rbenv_type, :user
set :rbenv_ruby, File.read('.ruby-version').strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
# set :rbenv_map_bins, %w{rake gem bundle ruby rails}
set :rbenv_roles, :all # default value

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
    end
  end

  desc 'Restart application'
    task :restart do
      on roles(:app), in: :sequence, wait: 5 do
      execute "sudo stop #{fetch(:application)} || true"
      execute "sudo start #{fetch(:application)}"
    end
  end

end

namespace :setup do
  desc "Copy secrets"
  task :secrets do
    on roles(:all) do |host|
      upload! "./config/secrets.yml", "#{shared_path}/config/secrets.yml"
    end
  end
end

namespace :upload do
  desc "Upload texts"
  task :epubs do
    on roles(:all) do |host|
      upload! "./epubs", "#{release_path}/epubs/", recursive: true
    end
  end
end

namespace :ingest do
  desc "Ingest epubs in /epubs"
  task :epubs do
    on roles(:app), in: :sequence, wait: 5 do
      execute "ruby -v"
#      execute "cd #{current_path}; ./bin/rake manifold:batch_ingest"
    end
  end
end