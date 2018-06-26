require "metadown/renderer"
require "metadown/metadata_parser"

# TODO: Fork Metadown gem and implement the custom renderer option

module Patches
  module MetadownCustomRenderer
    Data = Struct.new(:metadata, :output)

    def render(text, renderer = nil)
      return redcarpet_render(text) if renderer.nil?

      metadata = Metadown::MetadataParser.new(text).parse

      Data.new(metadata, renderer.render(text))
    end

    def redcarpet_render(text)
      renderer = Metadown::Renderer.new
      markdown = Redcarpet::Markdown.new(renderer)

      output = markdown.render(text)

      Data.new(renderer.metadata, output)
    end
  end
end

Metadown.singleton_class.prepend Patches::MetadownCustomRenderer
