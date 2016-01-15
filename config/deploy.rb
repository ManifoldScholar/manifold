# config valid only for current version of Capistrano
lock '3.4.0'

set :branch, 'development'


set :application, 'my_app_name'
set :repo_url, 'git@github.com:ManifoldScholar/manifold.git'
set :deploy_to, '/home/manifold/deploy'
set :scm, :git
set :format, :pretty
set :rails_env, 'production'

# Linked Files
set :linked_files, fetch(:linked_files, []).push('client/.env', 'api/.env', 'api/tmp', 'api/config/secrets.yml')
set :linked_dirs, fetch(:linked_dirs, []).push('api/public/system', 'texts')

# Ruby & Bundler
set :bundle_gemfile, -> { release_path.join('api').join('Gemfile') }
set :rbenv_type, :user
set :rbenv_ruby, File.read('api/.ruby-version').strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"

# NPM
set :npm_target_path, -> { release_path.join('client') }
set :npm_flags, '--silent --no-spin'
set :npm_env_variables, {}

# Persist node_modules across deploys to increase deployment speed
set :copy_files, ['client/node_modules']
set :copy_file_flags, ""
set :copy_dir_flags, "-R"
before "npm:install", "deploy:copy_files"

namespace :deploy do

  after :updated, :build_client_assets do
     on roles(:app), in: :groups, limit: 3, wait: 10 do
      with path: 'node_modules/.bin:$PATH' do
        within "#{release_path}/client" do
          execute :npm, 'run build'
        end
      end
    end
  end

  desc 'Restart API'
  task :restart_api do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo stop manifold_api || true"
      execute "sudo start manifold_api"
    end
  end

  desc 'Restart Client'
  task :restart_client do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo stop manifold_client || true"
      execute "sudo start manifold_client"
    end
  end

  after :published, :restart_api
  after :published, :restart_client

end

namespace :upload do
  task :texts do
    on roles(:app) do
      upload! './user_texts', '/home/manifold/deploy/shared/texts', recursive: true
    end
  end
end

namespace :ingest do
  task :texts do
    on roles(:app) do
      execute 'cd /home/manifold/deploy/current/api && ./bin/rake ingest:texts'
    end
  end
end

namespace :setup do
  task :manifold do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      execute 'cd /home/manifold/deploy/current/api && ./bin/rails g manifold:install'
    end
  end
end

