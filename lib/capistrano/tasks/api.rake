desc "Execute an API task"
namespace :api do
  task :rails do
    if ENV['TASK']
      on roles(:app) do
        within "#{current_path}/api" do
          with rails_env: fetch(:rails_env) do
            execute :rails, ENV['TASK']
          end
        end
      end
    else
      puts "\n\nFailed! You need to specify the 'TASK' parameter!",
           "Usage: cap <stage> invoke:rake TASK=your:task"
    end
  end
end
