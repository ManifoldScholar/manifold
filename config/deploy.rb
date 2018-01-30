# config valid only for current version of Capistrano
lock "3.4.1"
set :application, "Manifold"
set :repo_url, "git@github.com:ManifoldScholar/manifold.git"
set :deploy_to, "/home/manifold/deploy"
set :scm, :git
set :format, :pretty
set :rails_env, "production"

# Linked Files
set :linked_files, fetch(:linked_files, []).push(".env")
set :linked_files, fetch(:linked_files, []).push("client/dist/manifold/server.config.js")
set :linked_files, fetch(:linked_files, []).push("client/dist/manifold/www/browser.config.js")
set :linked_dirs, fetch(:linked_dirs, []).push(
  "api/public/system", "client/node_modules", "import", "api/tmp", "config/keys"
)

# Ruby & Bundler
set :bundle_gemfile, -> { release_path.join("api").join("Gemfile") }
set :rbenv_type, :user
set :rbenv_ruby, File.read("api/.ruby-version").strip
# rubocop:disable Metrics/LineLength
set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
# rubocop:enable Metrics/LineLength

# Yarn
set :yarn_target_path, -> { release_path.join("client") }
set :yarn_flags, "--production"

namespace :deploy do

  before :deploy, 'deploy:check_revision'

  after :check, :make_pid_dir do
    on roles(:app), in: :sequence, wait: 5 do
      with path: "./bin:$PATH" do
        execute :mkdir, "-p", "#{shared_path}/api/tmp/pids"
      end
    end
  end

  after :updated, :deploy_client do
    invoke "client:deploy"
  end

  after :published, :setup do
    invoke "setup:reseed"
  end

  after :published, :restart_services do
    invoke "services:restart"
  end

end
