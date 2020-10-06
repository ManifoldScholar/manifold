class DuplicateProject < ActiveInteraction::Base
  record :project

  def execute
    duplicate = project.dup

    duplicate.title = "#{project.title} (DUPE) #{SecureRandom.uuid}"

    duplicate.subtitle = "A duplicated project"

    duplicate.tag_list = "dupe"

    duplicate.save!
  end
end
