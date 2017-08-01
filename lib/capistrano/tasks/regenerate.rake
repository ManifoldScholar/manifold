namespace :regenerate do

  task :thumbnails do
    invoke "regenerate:thumbnails:makers"
    invoke "regenerate:thumbnails:collections"
    invoke "regenerate:thumbnails:resources"
    invoke "regenerate:thumbnails:projects"
    invoke "regenerate:thumbnails:users"
  end

  namespace :thumbnails do

    task "makers" do
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "paperclip:refresh CLASS=Maker"
          end
        end
      end
    end

    task "collections" do
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "paperclip:refresh CLASS=Collection"
          end
        end
      end
    end

    task "resources" do
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "paperclip:refresh CLASS=Resource"
          end
        end
      end
    end

    task "projects" do
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "paperclip:refresh CLASS=Project"
          end
        end
      end
    end

    task "users" do
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "paperclip:refresh CLASS=User"
          end
        end
      end
    end

  end
end
