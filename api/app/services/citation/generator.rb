require "citeproc"
require "csl/styles"

module Citation
  class Generator
    def cite(subject, styles)
      item = CiteProc::Item.new(map(subject))
      return {} unless subject.respond_to? :citation_parts

      styles.each_with_object(Hash.new(0)) do |style, results|
        cp = CiteProc::Processor.new style: style[1], format: "html"
        cp.import item
        citation = cp.render(:bibliography, id: subject.id).first
        results[style[0]] = citation unless citation.blank?
      end
    rescue TypeError
      Rails.logger.error("Error while generating citation: #{TypeError}")
      {}
    end

    def map(subject)
      return {} unless subject.respond_to? :citation_parts

      parts = []
      parts.push subject.metadata if subject.respond_to? :metadata
      parts.push(id: subject.id)
      parts.push(subject.citation_parts)
      props = parts.reject(&:nil?).reduce({}, :merge)
      props.transform_keys! { |key| key.to_s.tr("_", "-") }
      props
    end

  end
end
