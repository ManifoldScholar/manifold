# frozen_string_literal: true

module Patches
  # A very simple opt-in addon to support for using `websearch_to_tsquery` with PgSearch.
  #
  # It ignores most all options (aside from dictionary) and assumes you are ignoring accents.
  #
  # @see https://www.postgresql.org/docs/current/textsearch-controls.html
  module SupportWebsearch
    def rank_prefixed
      arel_wrap(prefixed_query)
    end

    def rank_query
      arel_wrap(tsquery)
    end

    def tsdocument
      if options[:composite]
        Arel.sql("#{quoted_table_name}.#{options[:composite]}")
      else
        super
      end
    end

    # @return [String]
    def tsquery
      return "''" if query.blank?

      if options[:websearch]
        quoted_query = Arel::Nodes.build_quoted(query)

        unaccented_query = Arel::Nodes::NamedFunction.new(PgSearch.unaccent_function, [quoted_query])

        Arel::Nodes::NamedFunction.new("websearch_to_tsquery", [dictionary, unaccented_query]).to_sql
      else
        super
      end
    end

    def ts_rank_function
      options[:ts_rank_function] || default_ts_rank_function
    end

    def tsearch_rank
      Arel::Nodes::NamedFunction.new(
        ts_rank_function,
        [
          arel_wrap(tsdocument),
          arel_wrap(tsquery),
          normalization
        ]
      ).to_sql
    end

    def prefixed_query
      query_terms = query.split.compact

      tsquery_terms = query_terms.map do |unsanitized_term|
        sanitized_term = unsanitized_term.gsub(PgSearch::Features::TSearch::DISALLOWED_TSQUERY_CHARACTERS, " ")

        term_sql = Arel.sql(normalize(connection.quote(sanitized_term)))

        tsquery = tsquery_expression(term_sql, negated: false, prefix: true)

        Arel::Nodes::NamedFunction.new("to_tsquery", [dictionary, tsquery]).to_sql
      end

      tsquery_terms.join(" && ")
    end

    private

    def default_ts_rank_function
      options[:websearch] ? "ts_rank_cd" : "ts_rank"
    end

    module ClassMethods
      def valid_options
        super + %i[composite ts_rank_function websearch]
      end
    end

    class << self
      def prepended(base)
        class << base
          prepend ClassMethods
        end
      end
    end
  end

  module SupportDMetaphoneComposite
    module ClassMethods
      def valid_options
        super + %i[composite]
      end
    end

    class << self
      def prepended(base)
        base.delegate :rank_prefixed, :rank_query, to: :tsearch

        class << base
          prepend ClassMethods
        end
      end
    end
  end

  module SupportTrigramComposite
    def rank_prefixed
      Arel::Nodes::Grouping.new(
        Arel::Nodes::InfixOperation.new(
          "||",
          normalized_query,
          Arel::Nodes.build_quoted(?%)
        )
      )
    end

    def rank_query
      Arel::Nodes::Grouping.new(normalized_query)
    end

    def normalized_document
      if options[:composite]
        Arel.sql("#{quoted_table_name}.#{options[:composite]}")
      else
        super
      end
    end

    module ClassMethods
      def valid_options
        super + %i[composite]
      end
    end

    class << self
      def prepended(base)
        class << base
          prepend ClassMethods
        end
      end
    end
  end

  module SupportRankQueries
    def rank
      (config.ranking_sql || ":tsearch").gsub(/(?::(?<feature>trigram|tsearch|dmetaphone)(?:_(?<subfield>prefixed|query))?)/) do
        feature = feature_for(Regexp.last_match[:feature])

        case Regexp.last_match[:subfield]
        when "prefixed"
          feature.rank_prefixed.to_sql
        when "query"
          feature.rank_query.to_sql
        else
          feature.rank.to_sql
        end
      end
    end
  end
end

PgSearch::Features::DMetaphone.prepend Patches::SupportDMetaphoneComposite
PgSearch::Features::TSearch.prepend Patches::SupportWebsearch
PgSearch::Features::Trigram.prepend Patches::SupportTrigramComposite
PgSearch::ScopeOptions.prepend Patches::SupportRankQueries
