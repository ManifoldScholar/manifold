module Citable
  extend ActiveSupport::Concern

  included do
    before_save :update_citations if respond_to? :before_save
  end

  # rubocop:disable Metrics/BlockLength
  class_methods do
    def with_citation(method = nil, &block)
      @generate_citation = block_given? ? block : method
    end

    def generate_citation(model)
      return model.send(@generate_citation) if @generate_citation.is_a? Symbol
      return @generate_citation.call(model) if @generate_citation.is_a? Proc
    end
  end

  def citation_styles
    Rails.configuration.manifold.citation_styles
  end

  def citation_parts
    base = respond_to?(:metadata) ? metadata : {}
    base ||= {}
    supplement = self.class.generate_citation(self) || {}
    base.merge(supplement).with_indifferent_access.delete_if { |_k, v| v.blank? }
  end

  def citable?
    parts = citation_parts
    %w(author issued title).all? { |s| parts.key? s }
  end

  def clear_citations
    self.citations = {}
  end

  def update_citations
    return clear_citations unless citable?
    generator = Citation::Generator.new
    self.citations = generator.cite(self, citation_styles)
  end
end
