module Citable
  extend ActiveSupport::Concern

  include ActiveSupport::Configurable

  included do
    config_accessor :citable_children, instance_writer: false do
      []
    end

    before_save :update_citations if respond_to? :before_save
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

  def citations_changed?(generated)
    citations != generated
  end

  def update_citations
    return clear_citations unless citable?

    generator = Citation::Generator.new
    generated_citations = generator.cite(self, citation_styles)
    return unless citations_changed?(generated_citations)

    self.citations = generated_citations
  end

  def update_citable_children
    return unless previous_changes.key?(:citations)

    UpdateCitatableChildren.perform_later(self)
  end

  class_methods do
    attr_reader :citable_children

    def with_citation(method = nil, &block)
      @generate_citation = block_given? ? block : method
    end

    def with_citable_children(*children)
      after_commit :update_citable_children if respond_to? :after_commit

      config.citable_children = children
    end

    def generate_citation(model)
      return model.send(@generate_citation) if @generate_citation.is_a? Symbol
      return @generate_citation.call(model) if @generate_citation.is_a? Proc
    end
  end
end
