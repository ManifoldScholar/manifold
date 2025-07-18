# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold100000 < SystemUpgrades::AbstractVersion
      def perform!
        generate_manifold_oai_records!
      end

      private

      def generate_manifold_oai_records!
        logger.info("===================================================================")
        logger.info("Generate Manifold OAI Records                                      ")
        logger.info("===================================================================")
        logger.info("Manifold version 10.0.0 exposes an OAI-PMH feed exposing metadata  ")
        logger.info("for projects, project-collections, and journals. Generating        ")
        logger.info("OAI records to populate that feed.                                 ")
        logger.info("===================================================================")

        Project.find_each do |project|
          project.manage_oai_record!
        end

        Journal.find_each do |journal|
          journal.manage_oai_record!
        end

        ProjectCollection.find_each do |collection|
          collection.manage_oai_set!
        end
      end
    end
  end
end
