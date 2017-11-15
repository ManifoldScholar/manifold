class AddSlugsToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :subject_slug, :string
    add_column :events, :project_slug, :string

    reversible do |change|
      change.up do
        say_with_time 'updating subject_slug and project_slug for events' do
          Event.all.each do |event|
            subject = event.subject
            project = event.project
            event.subject_slug = subject.slug if subject && subject.respond_to?(:slug)
            event.project_slug = project.slug
            event.save
          end
        end
      end
    end
  end
end
