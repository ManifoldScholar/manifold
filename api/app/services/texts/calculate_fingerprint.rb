module Texts
  class CalculateFingerprint < ActiveInteraction::Base
    include Concerns::MonadicInteraction

    record :text

    # @return [Digest::SHA512]
    attr_reader :digest

    # @return [String]
    def execute
      @digest = Digest::SHA512.new

      add_text_details!
      add_text_section_details!
      add_text_title_details!
      add_collaborator_details!

      digest.hexdigest
    end

    private

    # @return [void]
    def add_collaborator_details!
      text.collaborators.includes(:maker).each do |collaborator|
        add_collaborator_details_for! collaborator
      end
    end

    # @param [Collaborator] collaborator
    # @return [void]
    def add_collaborator_details_for!(collaborator)
      update_digest! collaborator.id
      update_digest! collaborator.maker_id
      update_digest! collaborator.role
      update_digest! collaborator.maker.name
    end

    # @return [void]
    def add_text_details!
      update_digest! text.id
      update_digest! text.description
      update_digest! text.landmarks
      update_digest! text.spine
      update_digest! text.toc
    end

    # @return [void]
    def add_text_section_details!
      text.text_sections.each do |text_section|
        add_text_section_details_for! text_section
      end
    end

    # @param [TextSection] text_section
    # @return [void]
    def add_text_section_details_for!(text_section)
      update_digest! text_section.id
      update_digest! text_section.source_identifier
      update_digest! text_section.body_json
      update_digest! text_section.citations
    end

    # @return [void]
    def add_text_title_details!
      text.titles.each do |text_title|
        add_text_title_details_for! text_title
      end
    end

    # @param [TextTitle] text_title
    # @return [void]
    def add_text_title_details_for!(text_title)
      update_digest! text_title.id
      update_digest! text_title.value
    end

    def make_digestable(value)
      return unless value.present?

      case value
      when String then value
      when Dux[:to_json] then value.to_json
      end
    end

    # @return [void]
    def update_digest!(value)
      digestable = make_digestable value

      return unless digestable.present?

      digest << digestable
    end
  end
end
