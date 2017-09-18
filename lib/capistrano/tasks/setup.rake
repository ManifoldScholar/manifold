namespace :setup do

  desc "Inspect environment"
  task :printenv do
    on roles(:app), in: :sequence, wait: 5 do
      with rails_env: fetch(:rails_env) do
        execute "printenv"
        execute "which rake"
      end
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

end
