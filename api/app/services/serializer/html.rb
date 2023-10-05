require "digest/md5"
require "securerandom"

module Serializer
  # This class takes HTML input and serializes it into a serializable data structure,
  # which will likely then be transformed into JSON. The Manifold React frontend can then
  # traverse this structure and create React components on the fly.
  class HTML
    ELEMENT_BLACK_LIST = %w(script link).freeze
    INLINE_ELEMENTS = %w(b big i small tt abbr acronym cite code dfn em kbd strong samp
                         time var a bdo br img map object q script span sub sup button
                         input label select textarea s strong u).freeze
    MATHML_ELEMENTS = %w(math maction annotation annotation-xml menclose merror mfenced
                         mfrac mi mmultiscripts mn mo mover mpadded mphantom mprescripts
                         mroot mrow ms semantics mspace msqrt mstyle msub msup msubsup
                         mtable mtd mtext mtr munder munderover ci cn cs csymbol apply bind
                         bvar share cerror cbytes).freeze

    def serialize(html, logger = Rails.logger)
      reset
      return if html.blank?

      fragment = Nokogiri::HTML.fragment(Validator::HTML.new.validate(html))
      node = fragment.children.first
      output = visit(node)
      check_for_node_uuid_duplicates(output, logger)
      output
    end

    protected

    def check_for_node_uuid_duplicates(output, logger)
      node_uuids = recursive_values(:node_uuid, output)
      duplicates = node_uuids.select { |uuid| node_uuids.count(uuid) > 1 }
      return if duplicates.empty?

      duplicates.each do |d|
        logger.error("Found duplicate node uuid: #{d}")
      end
      raise "There were duplicate node IDs in the text"
    end

    def recursive_values(key, structure, digests = [])
      return digests unless structure.key?(:children)

      structure[:children].each do |child|
        digests << child[key] if child.key?(key)
        recursive_values(key, child, digests) if child[:children].is_a? Array
      end
      digests
    end

    def visit(node)
      representation = {}
      visited = begin_visit(node, representation)
      return nil unless visited

      children = traverse(node) unless mathml_element?(representation) && representation[:content]
      representation[:children] = children unless children.nil?
      clean_empty_text_nodes!(representation)
      representation
    end

    def block_level_element?(representation)
      representation[:node_type] == "element" &&
        !INLINE_ELEMENTS.include?(representation[:tag])
    end

    def mathml_element?(representation)
      MATHML_ELEMENTS.include?(representation[:tag])
    end

    # rubocop:disable Metrics/PerceivedComplexity, Metrics/MethodLength, Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def clean_empty_text_nodes!(representation)
      return unless representation[:node_type] == "element"
      return unless block_level_element?(representation)
      return if representation[:children].nil? || representation[:children]&.empty?

      # Node is a block level element with children
      representation[:children].each_with_index do |child, index|
        next if child[:node_type] != "text"
        next unless child[:content].blank?

        child[:delete] = true if index.zero?
        child[:delete] = true if (index + 1) == representation[:children].length
        child[:delete] = true if mathml_element?(representation)
        # Between two block level elements
        next unless representation[:children][index - 1] &&
                    block_level_element?(representation[:children][index - 1]) &&
                    representation[:children][index + 1] &&
                    block_level_element?(representation[:children][index + 1])

        representation[:children][index][:delete] = true
      end
      representation[:children] = representation[:children].reject do |child|
        child[:delete] == true
      end
    end
    # rubocop:enable Metrics/PerceivedComplexity, Metrics/MethodLength, Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def traverse(node)
      children = nil
      node.children.each do |child_node|
        children ||= []
        representation = visit(child_node)
        children.push(representation) unless representation.nil?
      end
      children
    end

    def begin_visit(node, representation)
      return begin_visit_element(node, representation) if node.element?
      return begin_visit_comment(node, representation) if node.comment?
      return begin_visit_text(node, representation) if node.text?

      false
    end

    def begin_visit_element(node, representation)
      return false if ELEMENT_BLACK_LIST.include?(node.name.downcase)

      representation[:node_type] = "element"
      representation[:tag] = node.name
      representation[:attributes] = node.attributes
        .transform_keys(&:to_sym)
        .transform_values(&:content)
      merge_mathml_element_text_child(node, representation) if mathml_element?(representation)
      true
    end

    def begin_visit_comment(node, representation)
      representation[:node_type] = "comment"
      representation[:content] = node.content
      true
    end

    def begin_visit_text(node, representation)
      text_digest = Digest::SHA1.hexdigest(node.text)
      @digest_cache[text_digest] =
        @digest_cache.key?(text_digest) ? @digest_cache[text_digest] + 1 : 1
      node_digest = Digest::SHA1.hexdigest("#{text_digest}-#{@digest_cache[text_digest]}")
      representation[:node_type] = "text"
      representation[:content] = node.content
      representation[:text_digest] = text_digest
      representation[:node_uuid] = node_digest
      true
    end

    def text_only_child?(children)
      return false unless children.size == 1
      return false unless children[0].text?

      true
    end

    def merge_mathml_element_text_child(node, representation)
      return unless text_only_child?(node.children)

      begin_visit_text(node.children[0], representation)
    end

    def reset
      @parent_node = nil
      @current_node = nil
      @level = 0
      @digest_cache = {}
      @path = []
    end

    class << self
      # @param [String] html
      # @param [Logger] logger
      # @yield [json] validation block
      # @yieldparam [Hash] json the serialized value
      # @yieldreturn [void]
      # @return [Hash] JSON-serializable object
      def serialize_as_json(html, logger: Rails.logger)
        new.serialize(html, logger).as_json.tap do |json|
          yield json if block_given?
        end
      end
    end
  end
end
