module ResourceImports
  class Automap < ActiveInteraction::Base

    PSEUDONYMS = {
      "attachment" => ["filename"].freeze,
      "kind" => ["type"].freeze,
      "sub_kind" => ["sub type", "sub-type"].freeze,
      "external_url" => ["url"].freeze,
      "external_type" => ["host name"].freeze,
      "external_id" => ["file id", "video id"].freeze,
      "credit" => ["credit line"].freeze,
      "allow_high_res" => ["allow_high-res download", "allow high-res viewing"].freeze,
      "tag_list" => ["keywords"].freeze,
      "resource_collections" => ["collections"].freeze
    }.freeze

    record :resource_import

    def execute
      resource_import.column_automap = make_column_automap
    end

    private

    def ri
      resource_import
    end

    def similarity(column, header)
      return 0.0 if column.blank? || header.blank?

      column_chunks = trigramchunk(column.downcase)
      header_chunks = trigramchunk(header.downcase)
      all = (column_chunks | header_chunks).size
      same = (column_chunks & header_chunks).size
      same.to_f / all
    end

    def score(column, header)
      if PSEUDONYMS.key?(column)
        (PSEUDONYMS[column] + [column])
          .map { |pseudonym| similarity(pseudonym, header) }.max
      else
        similarity(column, header)
      end
    end

    def trigramchunk(word)
      chunks = []
      word.chars.each_cons(3) { |v| chunks << v.join }
      chunks
    end

    # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    def make_column_automap
      map = {}
      headers = ri.headers
      attributes = ResourceImport.available_columns.map
      return map unless headers

      matches = []
      headers.each do |header_index, header|
        attributes.each do |attribute|
          col_num = header_index.to_i
          compare = attribute.include?(".") ? attribute.split(".")[1] : attribute
          score = score(compare, header)
          if score > 0.2
            h = { header: header, attribute: attribute, col_num: col_num, score: score }
            matches << h
          end
        end
      end
      sorted_matches = matches.sort_by { |m| m[:score] }.reverse
      taken_attributes = []
      taken_keys = []
      sorted_matches.each do |match|
        key = match[:col_num].to_i
        attribute = match[:attribute]
        next if taken_attributes.include?(attribute) || taken_keys.include?(key)

        taken_attributes << attribute
        taken_keys << key
        map[key] = attribute
      end
      map.sort { |a, b| a[0].to_i <=> b[0].to_i }.to_h
    end
    # rubocop:enable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity

  end
end
