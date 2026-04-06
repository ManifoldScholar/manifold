# frozen_string_literal: true

class AddSeverityToIngestionMessages < ActiveRecord::Migration[7.0]
  def change
    create_enum :ingestion_message_severity, %w[
      unknown debug info warn error fatal
    ]

    reversible do |dir|
      dir.up do
        execute <<~SQL
        CREATE FUNCTION public.normalize_ingestion_message_severity(text) RETURNS public.ingestion_message_severity AS $$
        SELECT
        CASE LOWER($1)
        WHEN 'debug' THEN 'debug'::public.ingestion_message_severity
        WHEN 'info' THEN 'info'::public.ingestion_message_severity
        WHEN 'warn' THEN 'warn'::public.ingestion_message_severity
        WHEN 'error' THEN 'error'::public.ingestion_message_severity
        WHEN 'fatal' THEN 'fatal'::public.ingestion_message_severity
        ELSE 'unknown'::public.ingestion_message_severity
        END;
        $$ LANGUAGE SQL IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.extract_ingestion_message_severity(jsonb) RETURNS public.ingestion_message_severity AS $$
        SELECT
        CASE
        WHEN jsonb_typeof($1) = 'array' THEN public.normalize_ingestion_message_severity($1->>0)
        ELSE 'unknown'::public.ingestion_message_severity
        END;
        $$ LANGUAGE SQL IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.extract_ingestion_message_text(jsonb) RETURNS text AS $$
        SELECT
        CASE
        WHEN jsonb_typeof($1) = 'array' THEN $1->>1
        ELSE NULL
        END;
        $$ LANGUAGE SQL IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;
        SQL
      end

      dir.down do
        execute <<~SQL
        DROP FUNCTION public.extract_ingestion_message_text(jsonb);
        DROP FUNCTION public.extract_ingestion_message_severity(jsonb);
        DROP FUNCTION public.normalize_ingestion_message_severity(text);
        SQL
      end
    end

    change_table :ingestion_messages do |t|
      t.enum :severity, enum_type: :ingestion_message_severity, null: false, default: "unknown"

      t.index %[(extract_ingestion_message_text(payload))],
        name: "index_ingestion_messages_on_extracted_text",
        where: %[kind = 'log']
    end

    reversible do |dir|
      dir.up do
        say_with_time "Migrating ingestion message severities" do
          exec_update(<<~SQL, "Migrate severities")
          UPDATE ingestion_messages
          SET severity = public.extract_ingestion_message_severity(payload)
          WHERE kind = 'log';
          SQL
        end
      end
    end
  end
end
