# Helper service for creating Ingestions through the CLI.
# Its primary use is in rake tasks where the source file is not being received as an
# upload through Tus.
#
# As of upgrade to Shrine v3, this service is no longer necessary. Leaving it in place
# for other code that depends on it, but at this point it's purely pass-through. -ZD
module Ingestions
  class CreateManually < ActiveInteraction::Base
    object :project
    object :creator, class: "User", default: proc { User.cli_user }
    string :url, default: nil
    file :source, default: nil

    def execute
      Ingestion.create(source: source, external_source_url: url, project: project, creator: creator)
    end

  end
end
