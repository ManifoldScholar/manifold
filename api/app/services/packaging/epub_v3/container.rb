module Packaging
  module EpubV3
    # EpubV3 packaging services and operations.
    #
    # @api private
    class Container
      include IntrospectiveContainer

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

      register_simple_callables_in :book_compilation,
                                   :add_collaborators,
                                   :add_cover_image,
                                   :add_ingestion_sources,
                                   :add_remote_resources,
                                   :add_stylesheets,
                                   :add_text_sections,
                                   :add_titles,
                                   :finalize,
                                   :generate_nav_item,
                                   :pipeline,
                                   :prepare,
                                   :set_language,
                                   :set_primary_identifier

      register_simple_callables_in :text_compilation,
                                   :calculate_fingerprint,
                                   :extract_and_remap_ingestion_sources,
                                   :extract_collaborators,
                                   :extract_remote_resources,
                                   :extract_stylesheets,
                                   :extract_titles,
                                   :finalize,
                                   :group_referenced_items,
                                   :index_for_context,
                                   :link_external_sources,
                                   :pipeline,
                                   :prepare,
                                   :remap_text_section_links

      register_simple_callables_in :text_section_compilation,
                                   :build_initial_html,
                                   :extract_remote_resources,
                                   :extract_stylesheets,
                                   :finalize,
                                   :find_references,
                                   :insert_stylesheet_references,
                                   :pipeline,
                                   :prepare
    end
    # rubocop:enable
  end
end
