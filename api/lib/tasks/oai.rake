# frozen_string_literal: true

namespace :manifold do
  namespace :oai do
    desc <<~HEREDOC.strip
      Rebuilds all OAI-PMH records, sets, and set links from their source records.
      Intended to be run after truncating the manifold_oai_records, manifold_oai_sets,
      and manifold_oai_set_links tables. Respects draft and exclusion gating, and is
      safe to re-run.
    HEREDOC
    task resync: :environment do
      logger = Manifold::Rake.logger

      # Records, system sets, and per-container sets must exist before their links
      # can be created, so record/set sources are synced before set-link sources.
      record_sources = [Project, Journal, ProjectCollection]
      link_sources = [JournalIssue, CollectionProject]

      record_sources.each do |model|
        logger.info "Rebuilding OAI records and sets for #{model.name}"

        model.find_each do |record|
          record.manage_oai_record! if record.respond_to?(:manage_oai_record!)
          record.manage_oai_set! if record.respond_to?(:manage_oai_set!)
        end
      end

      link_sources.each do |model|
        logger.info "Rebuilding OAI set links for #{model.name}"

        model.find_each(&:manage_oai_set_link!)
      end

      logger.info "OAI resync complete"
    end
  end
end
