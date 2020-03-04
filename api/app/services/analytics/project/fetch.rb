module Analytics
  module Project
    class Fetch < ActiveInteraction::Base

      record :project
      date :start_date, default: 1.month.ago.utc.to_date
      # TODO: This is weird.
      date :end_date, default: Time.now.utc.to_date

      EVENTS_QUERY = <<~SQL.strip_heredoc.squish.freeze
        WITH days as (
          SELECT generate_series(
            DATE_TRUNC('day', $1::date),
            DATE_TRUNC('day', $2::date),
            '1 day'::interval
          ) AS day
        ),
        texts AS (
          SELECT project_id, id::text FROM texts WHERE texts.project_id = $3
        ),
        text_sections AS (
          SELECT text_sections.id::text
          FROM text_sections
          INNER JOIN texts ON text_sections.text_id::uuid = texts.id::uuid
                           AND texts.project_id = $4
        ),
        resources AS (
          SELECT id::text FROM resources WHERE resources.project_id = $5
        ),
        resource_collections AS (
          SELECT id::text FROM resource_collections WHERE resource_collections.project_id = $6
        )
        SELECT days.day,
               ae.project_views AS project_views,
               ae.resource_views AS resource_views,
               ae.resource_collection_views AS resource_collection_views,
               ae.text_views AS text_views,
               ae.text_section_views AS text_section_views
        FROM days
        LEFT JOIN LATERAL
          (
            SELECT
              count(*) FILTER (
                WHERE ae.name = 'view'
                AND ae.properties->>'resource_type' = 'projects'
                AND ae.properties->>'resource_id' = $7
              ) AS project_views,
              count(*) FILTER (
                WHERE ae.name = 'view'
                AND ae.properties->>'resource_type' = 'resource'
                AND ae.properties->>'resource_id' IN (SELECT id from resources)
              ) AS resource_views,
              count(*) FILTER (
                WHERE ae.name = 'view'
                AND ae.properties->>'resource_type' = 'resourceCollections'
                AND ae.properties->>'resource_id' IN (SELECT id FROM resource_collections)
              ) AS resource_collection_views,
              count(*) FILTER (
                WHERE ae.name = 'view'
                AND ae.properties->>'resource_type' = 'texts'
                AND ae.properties->>'resource_id' IN (SELECT id FROM texts)
              ) AS text_views,
              count(*) FILTER (
                WHERE ae.name = 'view'
                AND ae.properties->>'resource_type' = 'textSections'
                AND ae.properties->>'resource_id' IN (SELECT id FROM text_sections)
              ) AS text_section_views
            FROM ahoy_events ae
            WHERE ae.date = days.day
                  AND (
                    1 = 1 OR
                    ae.properties->>'id' = $8 AND ae.name = 'project.view'
                  )
          ) ae ON TRUE
      SQL

      STATISTICS_QUERY = <<~SQL.strip_heredoc.squish.freeze
        SELECT p.id AS project_id,
               pt.count AS text_count,
               pr.count AS resource_count,
               prc.count AS resource_collection_count,
               COALESCE(tac.annotations_count, 0) AS annotations_count,
               COALESCE(tac.highlights_count, 0) AS highlights_count
        FROM projects p
        LEFT JOIN LATERAL
          (SELECT count(*) AS COUNT
           FROM texts t
           WHERE t.project_id = $1 ) pt ON TRUE
        LEFT JOIN LATERAL
          (SELECT count(*) AS COUNT
           FROM resources r
           WHERE r.project_id = $1 ) pr ON TRUE
        LEFT JOIN LATERAL
          (SELECT count(*) AS COUNT
           FROM resource_collections rc
           WHERE rc.project_id = $1 ) prc ON TRUE
        LEFT JOIN LATERAL
          (SELECT COUNT(*) FILTER (
                                   WHERE a.format = 'annotation') AS annotations_count,
                  COUNT(*) FILTER (
                                   WHERE a.format = 'highlight') AS highlights_count
           FROM annotations a
           INNER JOIN text_sections ts ON ts.id = a.text_section_id
           INNER JOIN texts ON texts.id = ts.text_id
           WHERE texts.project_id = $1 ) tac ON TRUE
        WHERE p.id = $1 ;
      SQL

      isolatable!

      transactional!

      delegate :connection, to: ApplicationRecord

      def execute
        #statistics = connection.select_all STATISTICS_QUERY, "Fetch Project Statistics", [[project_id_column, project.id]], preparable: true
        {

        }
      end

      private

      attr_lazy_reader :time_column do
        Ahoy::Event.columns_hash.fetch "time"
      end

      attr_lazy_reader :project_id_column do
        ::Project.columns_hash.fetch "id"
      end

      def events
        results = connection.select_all EVENTS_QUERY, "Fetch Project Events", events_bindings, preparable: true
        results.map { |e| Response.new(e.merge(project: project)) }
      end

      def events_bindings
        [
          [time_column, start_date],
          [time_column, end_date],
          [project_id_column, project.id],
          [project_id_column, project.id],
          [project_id_column, project.id],
          [project_id_column, project.id],
          [project_id_column, project.id],
          [project_id_column, project.id]
        ]
      end

    end
  end
end
