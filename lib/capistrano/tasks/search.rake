# rubocop:disable Metrics/BlockLength
namespace :search do
  task :reindex do
    invoke "search:reindex:collection"
    invoke "search:reindex:event"
    invoke "search:reindex:maker"
    invoke "search:reindex:project"
    invoke "search:reindex:resource"
    invoke "search:reindex:user"
  end

  namespace :reindex do
    task("collection") { invoke "search:reindex:model", "Collection" }
    task("event") { invoke "search:reindex:model", "Event" }
    task("maker") { invoke "search:reindex:model", "Maker" }
    task("project") { invoke "search:reindex:model", "Project" }
    task("resource") { invoke "search:reindex:model", "Resource" }
    task("user") { invoke "search:reindex:model", "User" }

    task "model", :klass do |_task, args|
      klass = args[:klass]
      on roles(:app), in: :sequence, wait: 5 do
        with path: "./bin:$PATH" do
          within "#{current_path}/api" do
            execute :rails, "searchkick:reindex CLASS=#{klass}"
          end
        end
      end
      # Rake tasks can only be run once unless they're reenabled.
      ::Rake.application["search:reindex:model"].reenable
    end
  end
end
# rubocop:enable Metrics/BlockLength
