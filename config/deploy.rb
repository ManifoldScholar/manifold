# config valid only for current version of Capistrano
lock "3.4.1"

set :branch, "development"


set :application, "Manifold"
set :repo_url, "git@github.com:ManifoldScholar/manifold.git"
set :deploy_to, "/home/manifold/deploy"
set :scm, :git
set :format, :pretty
set :rails_env, "production"

# Linked Files
set :linked_files, fetch(:linked_files, []).push(".env", "api/tmp")
set :linked_dirs, fetch(:linked_dirs, []).push(
  "api/public/system", "client/node_modules", "import"
)

# Ruby & Bundler
set :bundle_gemfile, -> { release_path.join("api").join("Gemfile") }
set :rbenv_type, :user
set :rbenv_ruby, File.read("api/.ruby-version").strip
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"

# Yarn
set :yarn_target_path, -> { release_path.join("client") }
set :yarn_flags, "--production"

namespace :deploy do

  after :updated, :build_client_dist do
     on roles(:app), in: :groups, limit: 3, wait: 10 do
      with path: "node_modules/.bin:$PATH" do
        within "#{release_path}/client" do
          execute :yarn, "run dist"
        end
      end
    end
  end

  desc "Restart API"
  task :restart_api do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo systemctl stop manifold || true"
      execute "sudo systemctl start manifold"
    end
  end

  desc "Restart Workers"
  task :restart_workers do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo systemctl stop manifold_sidekiq_workers|| true"
      execute "sudo systemctl start manifold_sidekiq_workers"
    end
  end

  desc "Restart Client"
  task :restart_client do
    on roles(:app), in: :sequence, wait: 5 do
      execute "sudo systemctl stop manifold_client || true"
      execute "sudo systemctl start manifold_client"
    end
  end

  desc "Reseed the database"
  task :reseed do
    on roles(:app), in: :sequence, wait: 5 do
      with path: "./bin:$PATH" do
        within "#{current_path}/api" do
          execute :rails, "db:seed"
        end
      end
    end
  end

  after :published, :reseed
  after :published, :restart_api
  after :published, :restart_workers
  after :published, :restart_client

end

namespace :upload do
  task :projects do
    on roles(:app) do
      upload! "./import", "/home/manifold/deploy/shared/", recursive: true
    end
  end
end

namespace :import do
  task :projects do
    on roles(:app) do
      with path: "./bin:$PATH" do
        within "#{current_path}/api" do
          execute :rails, 'import:projects["../import"]'
        end
      end
    end
  end
end
