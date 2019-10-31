module Packaging
  module EpubV3
    # EpubV3 packaging services and operations.
    #
    # @api private
    # rubocop:disable Metrics/BlockLength
    class Container
      extend Dry::Container::Mixin

      register "api_url" do
        URI(Rails.configuration.manifold.api_url)
      end

      register "frontend_url" do
        URI(Rails.configuration.manifold.url)
      end

      register "reference_selectors" do
        Ingestions::PostProcessors::TextSectionBody::URI_ATTRIBUTES.map do |(tag, attribute)|
          Packaging::Shared::ReferenceSelector.new(tag, attribute)
        end
      end

      namespace "book_compilation" do
        register "add_collaborators" do
          Packaging::EpubV3::BookCompilation::AddCollaborators.new
        end

        register "add_ingestion_sources" do
          Packaging::EpubV3::BookCompilation::AddIngestionSources.new
        end

        register "add_remote_resources" do
          Packaging::EpubV3::BookCompilation::AddRemoteResources.new
        end

        register "add_stylesheets" do
          Packaging::EpubV3::BookCompilation::AddStylesheets.new
        end

        register "add_text_sections" do
          Packaging::EpubV3::BookCompilation::AddTextSections.new
        end

        register "add_titles" do
          Packaging::EpubV3::BookCompilation::AddTitles.new
        end

        register "finalize" do
          Packaging::EpubV3::BookCompilation::Finalize.new
        end

        register "generate_nav_item" do
          Packaging::EpubV3::BookCompilation::GenerateNavItem.new
        end

        register "pipeline" do
          Packaging::EpubV3::BookCompilation::Pipeline.new
        end

        register "prepare" do
          Packaging::EpubV3::BookCompilation::Prepare.new
        end

        register "set_language" do
          Packaging::EpubV3::BookCompilation::SetLanguage.new
        end

        register "set_primary_identifier" do
          Packaging::EpubV3::BookCompilation::SetPrimaryIdentifier.new
        end
      end

      namespace "text_compilation" do
        register "calculate_fingerprint" do
          Packaging::EpubV3::TextCompilation::CalculateFingerprint.new
        end

        register "extract_and_remap_ingestion_sources" do
          Packaging::EpubV3::TextCompilation::ExtractAndRemapIngestionSources.new
        end

        register "extract_collaborators" do
          Packaging::EpubV3::TextCompilation::ExtractCollaborators.new
        end

        register "extract_remote_resources" do
          Packaging::EpubV3::TextCompilation::ExtractRemoteResources.new
        end

        register "extract_stylesheets" do
          Packaging::EpubV3::TextCompilation::ExtractStylesheets.new
        end

        register "extract_titles" do
          Packaging::EpubV3::TextCompilation::ExtractTitles.new
        end

        register "finalize" do
          Packaging::EpubV3::TextCompilation::Finalize.new
        end

        register "group_referenced_items" do
          Packaging::EpubV3::TextCompilation::GroupReferencedItems.new
        end

        register "index_for_context" do
          Packaging::EpubV3::TextCompilation::IndexForContext.new
        end

        register "link_external_sources" do
          Packaging::EpubV3::TextCompilation::LinkExternalSources.new
        end

        register "pipeline" do
          Packaging::EpubV3::TextCompilation::Pipeline.new
        end

        register "prepare" do
          Packaging::EpubV3::TextCompilation::Prepare.new
        end

        register "remap_text_section_links" do
          Packaging::EpubV3::TextCompilation::RemapTextSectionLinks.new
        end
      end

      namespace "text_section_compilation" do
        register "build_initial_html" do
          Packaging::EpubV3::TextSectionCompilation::BuildInitialHTML.new
        end

        register "extract_remote_resources" do
          Packaging::EpubV3::TextSectionCompilation::ExtractRemoteResources.new
        end

        register "extract_stylesheets" do
          Packaging::EpubV3::TextSectionCompilation::ExtractStylesheets.new
        end

        register "finalize" do
          Packaging::EpubV3::TextSectionCompilation::Finalize.new
        end

        register "find_references" do
          Packaging::EpubV3::TextSectionCompilation::FindReferences.new
        end

        register "insert_stylesheet_references" do
          Packaging::EpubV3::TextSectionCompilation::InsertStylesheetReferences.new
        end

        register "pipeline" do
          Packaging::EpubV3::TextSectionCompilation::Pipeline.new
        end

        register "prepare" do
          Packaging::EpubV3::TextSectionCompilation::Prepare.new
        end
      end
    end
    # rubocop:enable Metrics/BlockLength
  end
end
