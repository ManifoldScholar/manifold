namespace :import do

  task :upload_projects do
    on roles(:app) do
      system("rsync -azv --progress ./import/ #{host.username}@#{host.hostname}:/home/manifold/deploy/shared/import/")
    end
  end

  task :projects, :project do |t, args|
    project = args[:project]
    path = "../import"
    task = project ? "import:project" : "import:projects"
    path << "/#{project}" if project
    on roles(:app) do
      with path: "./bin:$PATH" do
        within "#{current_path}/api" do
          cmd = "#{task}[\"#{path}\"]"
          execute :rails, cmd
        end
      end
    end
  end
end
