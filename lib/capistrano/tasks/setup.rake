namespace :setup do
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
