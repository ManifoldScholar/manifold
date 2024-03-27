SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: btree_gin; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gin WITH SCHEMA public;


--
-- Name: EXTENSION btree_gin; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gin IS 'support for indexing common datatypes in GIN';


--
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: intarray; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS intarray WITH SCHEMA public;


--
-- Name: EXTENSION intarray; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION intarray IS 'functions, operators, and index support for 1-D arrays of integers';


--
-- Name: ltree; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;


--
-- Name: EXTENSION ltree; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: manifold_slugify(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.manifold_slugify(text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $_$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent(btrim($1)) AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9_-]+', '-', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '-+$', ''), '^-+', '') AS "value"
    FROM "hyphenated"
  )
  SELECT NULLIF("value", '') FROM "trimmed";
$_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: action_callouts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.action_callouts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying,
    url character varying,
    kind integer DEFAULT 0 NOT NULL,
    location integer DEFAULT 0 NOT NULL,
    attachment_data jsonb,
    button boolean DEFAULT false,
    "position" integer DEFAULT 1 NOT NULL,
    text_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    visibility integer DEFAULT 0 NOT NULL,
    calloutable_type character varying,
    calloutable_id uuid
);


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visit_id uuid NOT NULL,
    name character varying NOT NULL,
    properties jsonb DEFAULT '{}'::jsonb NOT NULL,
    "time" timestamp without time zone NOT NULL
);


--
-- Name: analytics_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visit_token character varying NOT NULL,
    visitor_token character varying NOT NULL,
    ip character varying,
    user_agent text,
    referrer text,
    referring_domain character varying,
    landing_page text,
    browser character varying,
    os character varying,
    device_type character varying,
    country character varying,
    region character varying,
    city character varying,
    latitude double precision,
    longitude double precision,
    utm_source character varying,
    utm_medium character varying,
    utm_term character varying,
    utm_content character varying,
    utm_campaign character varying,
    app_version character varying,
    os_version character varying,
    platform character varying,
    started_at timestamp without time zone,
    ended_at timestamp without time zone
);


--
-- Name: annotations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.annotations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    start_node character varying,
    end_node character varying,
    start_char integer,
    end_char integer,
    subject text,
    text_section_id uuid,
    format character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    creator_id uuid,
    resource_id uuid,
    body text,
    private boolean DEFAULT false,
    comments_count integer DEFAULT 0,
    resource_collection_id uuid,
    events_count integer DEFAULT 0,
    orphaned boolean DEFAULT false NOT NULL,
    flags_count integer DEFAULT 0,
    reading_group_id uuid
);


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    body text,
    creator_id uuid,
    parent_id uuid,
    subject_id uuid,
    subject_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted boolean DEFAULT false,
    children_count integer DEFAULT 0,
    flags_count integer DEFAULT 0,
    sort_order integer,
    events_count integer DEFAULT 0
);


--
-- Name: reading_group_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_memberships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    reading_group_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    anonymous_label character varying,
    aasm_state text DEFAULT 'active'::text NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    label text DEFAULT ''::text,
    annotation_style text DEFAULT 'solid'::text NOT NULL,
    archived_at timestamp without time zone
);


--
-- Name: annotation_membership_comments; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.annotation_membership_comments AS
 SELECT c.id AS comment_id,
    c.creator_id AS user_id,
    c.subject_id AS annotation_id,
    c.parent_id,
    a.creator_id AS annotation_user_id,
    a.reading_group_id,
    rgm.id AS reading_group_membership_id,
    rgm.aasm_state
   FROM ((public.comments c
     JOIN public.annotations a ON ((a.id = c.subject_id)))
     JOIN public.reading_group_memberships rgm ON (((rgm.reading_group_id = a.reading_group_id) AND (rgm.user_id = c.creator_id))))
  WHERE (((c.subject_type)::text = 'Annotation'::text) AND (a.reading_group_id IS NOT NULL) AND (a.creator_id IS NOT NULL) AND (a.creator_id <> c.creator_id));


--
-- Name: text_section_nodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_section_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    text_section_id uuid NOT NULL,
    body_hash bigint DEFAULT 0 NOT NULL,
    node_root public.ltree NOT NULL,
    node_path public.ltree NOT NULL,
    path text[] NOT NULL,
    node_indices integer[] NOT NULL,
    depth bigint DEFAULT 0 NOT NULL,
    node_index bigint,
    node_type text,
    tag text,
    node_attributes jsonb DEFAULT '{}'::jsonb NOT NULL,
    node_uuid text,
    node_extra jsonb,
    text_digest text,
    content text,
    children_count bigint DEFAULT 0 NOT NULL,
    extrapolated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    intermediate boolean DEFAULT false NOT NULL
);


--
-- Name: text_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_sections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    source_body text,
    body text,
    source_identifier character varying,
    text_id uuid,
    legacy_position integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    kind character varying,
    ingestion_source_id uuid,
    body_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    citations jsonb DEFAULT '{}'::jsonb,
    "position" bigint,
    body_hash bigint GENERATED ALWAYS AS (COALESCE(hashtextextended((body_json)::text, (0)::bigint), (0)::bigint)) STORED NOT NULL,
    node_root public.ltree GENERATED ALWAYS AS (public.text2ltree(((md5((id)::text) || '.'::text) || md5((COALESCE(hashtextextended((body_json)::text, (0)::bigint), (0)::bigint))::text)))) STORED NOT NULL,
    slug text,
    hidden_in_reader boolean DEFAULT false NOT NULL,
    CONSTRAINT text_sections_body_json_must_be_object CHECK ((jsonb_typeof(body_json) = 'object'::text))
);


--
-- Name: annotation_nodes; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.annotation_nodes AS
 SELECT DISTINCT ON (a.id) a.id AS annotation_id,
    a.text_section_id,
    ancestor_node.id AS ancestor_node_id,
    start_node.id AS start_node_id,
    end_node.id AS end_node_id,
    (ts.body_json #> ancestor_node.path) AS existing_node,
    (ts.id IS NOT NULL) AS matches_text_section,
    start_node.extrapolated_at AS start_node_extrapolated_at,
    end_node.extrapolated_at AS end_node_extrapolated_at,
    ancestor_node.extrapolated_at AS ancestor_node_extrapolated_at
   FROM ((((public.annotations a
     LEFT JOIN public.text_section_nodes start_node ON (((start_node.text_section_id = a.text_section_id) AND (start_node.node_uuid = (a.start_node)::text))))
     LEFT JOIN public.text_section_nodes end_node ON (((end_node.text_section_id = a.text_section_id) AND (end_node.node_uuid = (a.end_node)::text))))
     LEFT JOIN public.text_section_nodes ancestor_node ON (((ancestor_node.node_path OPERATOR(public.@>) start_node.node_path) AND (ancestor_node.node_path OPERATOR(public.@>) end_node.node_path) AND (NOT ancestor_node.intermediate))))
     LEFT JOIN public.text_sections ts ON (((ts.id = a.text_section_id) AND (ts.body_hash = ancestor_node.body_hash))))
  ORDER BY a.id, ancestor_node.extrapolated_at DESC NULLS LAST, ancestor_node.depth DESC NULLS LAST;


--
-- Name: annotation_reading_group_memberships; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.annotation_reading_group_memberships AS
 SELECT a.id AS annotation_id,
    a.reading_group_id,
    a.creator_id AS user_id,
    rgm.id AS reading_group_membership_id,
    rgm.aasm_state
   FROM (public.annotations a
     LEFT JOIN public.reading_group_memberships rgm ON (((rgm.reading_group_id = a.reading_group_id) AND (rgm.user_id = a.creator_id))))
  WHERE ((a.creator_id IS NOT NULL) AND (a.reading_group_id IS NOT NULL));


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: cached_external_source_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cached_external_source_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cached_external_source_id uuid NOT NULL,
    text_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: cached_external_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cached_external_sources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url text NOT NULL,
    source_identifier text NOT NULL,
    kind text DEFAULT 'unknown'::text NOT NULL,
    content_type text NOT NULL,
    asset_data jsonb,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_id uuid,
    title character varying,
    role character varying,
    "position" integer
);


--
-- Name: collaborators; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaborators (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    maker_id uuid,
    role character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    "position" integer,
    collaboratable_type character varying,
    collaboratable_id uuid
);


--
-- Name: collection_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection_projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_collection_id uuid NOT NULL,
    project_id uuid NOT NULL,
    "position" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_collection_sort_orders; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.project_collection_sort_orders AS
 WITH allowed_columns AS (
         SELECT t.column_name
           FROM ( VALUES ('created_at'::text), ('updated_at'::text), ('publication_date'::text), ('title'::text)) t(column_name)
        ), allowed_directions AS (
         SELECT t.direction
           FROM ( VALUES ('asc'::text), ('desc'::text)) t(direction)
        ), allowed_sort_orders AS (
         SELECT allowed_columns.column_name,
            allowed_directions.direction,
            concat(allowed_columns.column_name, '_', allowed_directions.direction) AS sort_order,
            (allowed_directions.direction = 'asc'::text) AS ascending,
            (allowed_directions.direction = 'desc'::text) AS descending
           FROM allowed_columns,
            allowed_directions
        )
 SELECT allowed_sort_orders.column_name,
    allowed_sort_orders.direction,
    allowed_sort_orders.sort_order,
    allowed_sort_orders.ascending,
    allowed_sort_orders.descending
   FROM allowed_sort_orders
  WITH NO DATA;


--
-- Name: project_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_collections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    "position" integer,
    sort_order character varying DEFAULT 'created_at_asc'::character varying NOT NULL,
    smart boolean DEFAULT false NOT NULL,
    visible boolean DEFAULT false NOT NULL,
    homepage boolean DEFAULT false NOT NULL,
    icon character varying,
    number_of_projects integer,
    featured_only boolean DEFAULT false NOT NULL,
    slug character varying,
    description character varying,
    creator_id uuid,
    collection_projects_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    descriptions text,
    homepage_start_date date,
    homepage_end_date date,
    homepage_count integer,
    hero_layout integer DEFAULT 0 NOT NULL,
    custom_icon_data jsonb,
    hero_data jsonb,
    social_image_data jsonb,
    social_description text,
    social_title text,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    short_description text
);


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying,
    subtitle character varying,
    description text,
    cover_file_name_deprecated character varying,
    cover_content_type_deprecated character varying,
    cover_file_size_deprecated integer,
    cover_updated_at_deprecated timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    featured boolean DEFAULT false,
    hashtag character varying,
    purchase_url character varying,
    purchase_price_in_cents bigint,
    purchase_price_currency character varying,
    purchase_call_to_action character varying,
    instagram_id character varying,
    twitter_id character varying,
    facebook_id character varying,
    hero_file_name_deprecated character varying,
    hero_content_type_deprecated character varying,
    hero_file_size_deprecated integer,
    hero_updated_at_deprecated timestamp without time zone,
    avatar_file_name_deprecated character varying,
    avatar_content_type_deprecated character varying,
    avatar_file_size_deprecated integer,
    avatar_updated_at_deprecated timestamp without time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator_id uuid,
    publication_date date,
    slug character varying,
    avatar_color character varying DEFAULT 'primary'::character varying,
    citations jsonb DEFAULT '{}'::jsonb,
    draft boolean DEFAULT true NOT NULL,
    hide_activity boolean DEFAULT false,
    sort_title public.citext,
    events_count integer DEFAULT 0,
    download_url character varying,
    download_call_to_action character varying,
    cover_data jsonb,
    hero_data jsonb,
    avatar_data jsonb,
    dark_mode boolean DEFAULT false NOT NULL,
    image_credits text,
    standalone_mode integer DEFAULT 0 NOT NULL,
    standalone_mode_press_bar_text character varying,
    standalone_mode_press_bar_url character varying,
    finished boolean DEFAULT false,
    resource_collections_count integer DEFAULT 0,
    resources_count integer DEFAULT 0,
    fingerprint text NOT NULL,
    export_configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
    restricted_access boolean DEFAULT false NOT NULL,
    restricted_access_heading character varying,
    restricted_access_body text,
    open_access boolean DEFAULT false NOT NULL,
    disable_engagement boolean DEFAULT false,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    journal_issue_id uuid
);


--
-- Name: collection_project_rankings; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.collection_project_rankings AS
 SELECT cp.id AS collection_project_id,
    cp.project_collection_id,
    cp.project_id,
    rank() OVER outer_w AS ranking,
    rank() OVER global_w AS global_ranking,
    pc.sort_order,
    sv.sort_order AS dynamic_sort_order,
    dsv.dynamic_sort_value,
    manual.ranking AS manual_sort_value
   FROM (((((public.collection_projects cp
     JOIN public.project_collections pc ON ((pc.id = cp.project_collection_id)))
     JOIN public.projects p ON ((p.id = cp.project_id)))
     LEFT JOIN LATERAL ( SELECT cp."position" AS ranking
          WHERE ((pc.sort_order)::text = 'manual'::text)) manual ON (((pc.sort_order)::text = 'manual'::text)))
     LEFT JOIN public.project_collection_sort_orders sv ON ((((pc.sort_order)::text <> 'manual'::text) AND ((pc.sort_order)::text = sv.sort_order))))
     LEFT JOIN LATERAL ( SELECT
                CASE sv.column_name
                    WHEN 'created_at'::text THEN ((p.created_at)::text)::character varying
                    WHEN 'updated_at'::text THEN ((p.updated_at)::text)::character varying
                    WHEN 'publication_date'::text THEN ((p.publication_date)::text)::character varying
                    WHEN 'title'::text THEN p.title
                    ELSE p.title
                END AS dynamic_sort_value) dsv ON (((pc.sort_order)::text <> 'manual'::text)))
  WINDOW outer_w AS (PARTITION BY cp.project_collection_id ORDER BY
        CASE
            WHEN ((pc.sort_order)::text = 'manual'::text) THEN manual.ranking
            ELSE NULL::integer
        END,
        CASE
            WHEN sv.descending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END DESC,
        CASE
            WHEN sv.ascending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END), global_w AS (ORDER BY pc."position",
        CASE
            WHEN ((pc.sort_order)::text = 'manual'::text) THEN manual.ranking
            ELSE NULL::integer
        END,
        CASE
            WHEN sv.descending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END DESC,
        CASE
            WHEN sv.ascending THEN dsv.dynamic_sort_value
            ELSE NULL::character varying
        END);


--
-- Name: collection_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collection_resources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    resource_id uuid,
    resource_collection_id uuid,
    "position" integer DEFAULT 0,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comment_hierarchies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_hierarchies (
    ancestor_id uuid NOT NULL,
    descendant_id uuid NOT NULL,
    generations integer NOT NULL
);


--
-- Name: content_block_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_block_references (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    content_block_id uuid,
    referencable_type character varying,
    referencable_id uuid,
    kind character varying NOT NULL,
    "position" integer
);


--
-- Name: content_blocks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_blocks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying NOT NULL,
    configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
    "position" integer,
    project_id uuid,
    visible boolean DEFAULT true NOT NULL,
    access integer DEFAULT 0 NOT NULL,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: entitlement_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    kind text DEFAULT 'unknown'::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    resource_type character varying,
    resource_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    kind text DEFAULT 'unknown'::text NOT NULL
);


--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


--
-- Name: entitlement_assigned_roles; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.entitlement_assigned_roles AS
 SELECT ur.user_id,
    er.id AS entitlement_role_id,
    r.resource_id,
    r.resource_type,
    r.name AS role_name,
    r.id AS role_id
   FROM ((public.roles r
     JOIN public.entitlement_roles er ON (((r.name)::text = er.name)))
     JOIN public.users_roles ur ON ((ur.role_id = r.id)));


--
-- Name: entitlement_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_transitions (
    id bigint NOT NULL,
    entitlement_id uuid NOT NULL,
    sort_key integer NOT NULL,
    most_recent boolean NOT NULL,
    to_state text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: entitlement_user_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_user_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entitlement_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: entitlements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    target_type character varying NOT NULL,
    target_id uuid NOT NULL,
    entitler_id uuid NOT NULL,
    subject_type character varying NOT NULL,
    subject_id uuid NOT NULL,
    expires_on date,
    expired_at timestamp without time zone,
    kind text DEFAULT 'unknown'::text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    global_roles jsonb DEFAULT '{}'::jsonb NOT NULL,
    scoped_roles jsonb DEFAULT '{}'::jsonb NOT NULL,
    options jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: journal_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    journal_id uuid NOT NULL,
    journal_volume_id uuid,
    creator_id uuid,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    number character varying DEFAULT ''::character varying NOT NULL,
    sort_title integer DEFAULT 0 NOT NULL,
    pending_sort_title integer
);


--
-- Name: journal_volumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_volumes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    journal_id uuid NOT NULL,
    creator_id uuid,
    number integer,
    subtitle text,
    journal_issues_count integer DEFAULT 0 NOT NULL,
    slug text
);


--
-- Name: journal_project_links; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.journal_project_links AS
 SELECT DISTINCT ON (ji.journal_id, p.id) ji.journal_id,
    p.id AS project_id,
    dense_rank() OVER w AS "position"
   FROM ((public.journal_issues ji
     LEFT JOIN public.journal_volumes jv ON ((jv.id = ji.journal_volume_id)))
     JOIN public.projects p ON ((p.journal_issue_id = ji.id)))
  WINDOW w AS (PARTITION BY ji.journal_id ORDER BY jv.number NULLS FIRST, ji.sort_title NULLS FIRST, p.sort_title)
  ORDER BY ji.journal_id, p.id, jv.number NULLS FIRST, ji.sort_title NULLS FIRST, p.sort_title;


--
-- Name: user_entitlements; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_entitlements AS
 SELECT ent.id,
    eul.user_id,
    eul.entitlement_id,
    ent.target_type,
    ent.target_id,
    ent.entitler_id,
    ent.subject_type,
    ent.subject_id,
    ent.expires_on,
    ent.expired_at,
    ent.kind,
    ent.description,
    ent.global_roles,
    ent.scoped_roles,
    ent.options,
    ent.metadata,
    ent.created_at,
    ent.updated_at
   FROM (public.entitlement_user_links eul
     JOIN public.entitlements ent ON ((ent.id = eul.entitlement_id)));


--
-- Name: entitlement_derived_roles; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.entitlement_derived_roles AS
 SELECT ent.user_id,
    ent.id AS entitlement_id,
    ent.created_at AS granted_at,
    COALESCE(most_recent_entitlement_transition.to_state, 'pending'::text) AS current_state,
    r.entitlement_role_id,
    r.role_name,
    r.role_kind,
    r.resource_id,
    r.resource_type,
    r.inferred,
    ent.expires_on,
    ent.expired_at,
    (ent.expired_at IS NOT NULL) AS expired
   FROM ((public.user_entitlements ent
     LEFT JOIN public.entitlement_transitions most_recent_entitlement_transition ON (((ent.id = most_recent_entitlement_transition.entitlement_id) AND (most_recent_entitlement_transition.most_recent = true))))
     LEFT JOIN LATERAL ( SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            ent.subject_id AS resource_id,
            ent.subject_type AS resource_type,
            false AS inferred
           FROM (jsonb_each(ent.global_roles) t(name, value)
             JOIN public.entitlement_roles er USING (name))
          WHERE (t.value = to_jsonb(true))
        UNION ALL
         SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            ent.subject_id AS resource_id,
            ent.subject_type AS resource_type,
            false AS inferred
           FROM (jsonb_each(ent.scoped_roles) t(name, value)
             JOIN public.entitlement_roles er USING (name))
          WHERE (t.value = to_jsonb(true))
        UNION ALL
         SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            cp.project_id AS resource_id,
            'Project'::character varying AS resource_type,
            true AS inferred
           FROM ((jsonb_each(ent.scoped_roles) t(name, value)
             JOIN public.entitlement_roles er USING (name))
             JOIN public.collection_projects cp ON ((cp.project_collection_id = ent.subject_id)))
          WHERE (((ent.subject_type)::text = 'ProjectCollection'::text) AND (t.value = to_jsonb(true)))
        UNION ALL
         SELECT er.id AS entitlement_role_id,
            er.name AS role_name,
            er.kind AS role_kind,
            jpl.project_id AS resource_id,
            'Project'::character varying AS resource_type,
            true AS inferred
           FROM ((jsonb_each(ent.scoped_roles) t(name, value)
             JOIN public.entitlement_roles er USING (name))
             JOIN public.journal_project_links jpl ON ((jpl.journal_id = ent.subject_id)))
          WHERE (((ent.subject_type)::text = 'Journal'::text) AND (t.value = to_jsonb(true)))) r ON (true));


--
-- Name: entitlement_grants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_grants (
    user_id uuid NOT NULL,
    entitlement_role_id uuid NOT NULL,
    resource_type character varying NOT NULL,
    resource_id uuid NOT NULL,
    role_name text NOT NULL,
    role_kind text NOT NULL,
    current_state text NOT NULL,
    expired boolean DEFAULT false NOT NULL,
    inferred boolean DEFAULT false NOT NULL,
    has_ever_been_expired boolean DEFAULT false NOT NULL,
    has_ever_been_inferred boolean DEFAULT false NOT NULL,
    active_entitlements_count bigint DEFAULT 0 NOT NULL,
    expiring_soon_entitlements_count bigint DEFAULT 0 NOT NULL,
    expired_entitlements_count bigint DEFAULT 0 NOT NULL,
    first_granted_at timestamp(6) without time zone,
    last_expired_at timestamp(6) without time zone,
    refresh_key uuid NOT NULL,
    refreshed_at timestamp(6) without time zone NOT NULL,
    summaries jsonb DEFAULT '[]'::jsonb NOT NULL
);


--
-- Name: entitlement_grant_audits; Type: MATERIALIZED VIEW; Schema: public; Owner: -
--

CREATE MATERIALIZED VIEW public.entitlement_grant_audits AS
 SELECT user_id,
    entitlement_role_id,
    resource_id,
    resource_type,
    role_name,
    x.has_entitlement,
    x.has_assigned_role,
        CASE
            WHEN (x.has_entitlement AND (NOT x.has_assigned_role)) THEN 'add_role'::text
            WHEN ((NOT x.has_entitlement) AND x.has_assigned_role) THEN 'remove_role'::text
            ELSE 'skip'::text
        END AS action
   FROM ((public.entitlement_grants eg
     FULL JOIN public.entitlement_assigned_roles ear USING (user_id, entitlement_role_id, resource_id, resource_type, role_name))
     LEFT JOIN LATERAL ( SELECT ((eg.summaries IS NOT NULL) AND (NOT eg.expired)) AS has_entitlement,
            (ear.role_id IS NOT NULL) AS has_assigned_role) x ON (true))
  WITH NO DATA;


--
-- Name: entitlement_import_row_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_import_row_transitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    to_state character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_key integer NOT NULL,
    entitlement_import_row_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: entitlement_import_rows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_import_rows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entitlement_import_id uuid NOT NULL,
    entitlement_id uuid,
    subject_type character varying,
    subject_id uuid,
    target_type character varying,
    target_id uuid,
    line_number bigint NOT NULL,
    email public.citext,
    expires_on date,
    messages text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pending_entitlement_id uuid,
    expiration text,
    first_name text,
    last_name text
);


--
-- Name: entitlement_import_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_import_transitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    to_state character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_key integer NOT NULL,
    entitlement_import_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: entitlement_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlement_imports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid,
    name public.citext NOT NULL,
    file_data jsonb,
    entitlement_import_rows_count bigint DEFAULT 0 NOT NULL,
    messages text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reading_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying,
    privacy character varying DEFAULT 'private'::character varying,
    invitation_code character varying,
    notify_on_join boolean DEFAULT true,
    creator_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    reading_group_kind_id uuid,
    course jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email public.citext,
    first_name character varying,
    last_name character varying,
    password_digest character varying,
    password character varying,
    password_confirmation character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    nickname text,
    avatar_file_name_deprecated character varying,
    avatar_content_type_deprecated character varying,
    avatar_file_size_deprecated integer,
    avatar_updated_at_deprecated timestamp without time zone,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    raw_persistent_ui jsonb DEFAULT '{}'::jsonb NOT NULL,
    classification character varying DEFAULT 'default'::character varying NOT NULL,
    imported_at timestamp without time zone,
    import_source_id character varying,
    avatar_data jsonb,
    role text NOT NULL,
    kind text NOT NULL,
    consent_manifold_analytics boolean,
    consent_google_analytics boolean,
    terms_and_conditions_accepted_at timestamp without time zone,
    email_confirmation_token text,
    email_confirmation_sent_at timestamp(6) without time zone,
    email_confirmed_at timestamp(6) without time zone,
    verified_by_admin_at timestamp without time zone,
    established boolean DEFAULT false NOT NULL,
    trusted boolean DEFAULT false NOT NULL
);


--
-- Name: entitlement_targets; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.entitlement_targets AS
 SELECT 'User'::text AS target_type,
    users.id AS target_id,
    concat('gid://manifold-api/User/', users.id) AS target_url,
    concat(users.first_name, ' ', users.last_name) AS name,
    'public'::text AS visibility,
    concat('1', users.first_name, ' ', users.last_name) AS sort_key
   FROM public.users
  WHERE ((users.classification)::text = 'default'::text)
UNION ALL
 SELECT 'ReadingGroup'::text AS target_type,
    reading_groups.id AS target_id,
    concat('gid://manifold-api/ReadingGroup/', reading_groups.id) AS target_url,
    reading_groups.name,
        CASE reading_groups.privacy
            WHEN 'public'::text THEN 'public'::text
            ELSE 'private'::text
        END AS visibility,
    concat('2', reading_groups.name) AS sort_key
   FROM public.reading_groups;


--
-- Name: entitlement_transitions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.entitlement_transitions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: entitlement_transitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.entitlement_transitions_id_seq OWNED BY public.entitlement_transitions.id;


--
-- Name: entitlers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entitlers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type character varying NOT NULL,
    entity_id uuid NOT NULL,
    name text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    event_type character varying,
    event_url character varying,
    subject_id uuid,
    subject_type character varying,
    subject_title character varying,
    subject_subtitle character varying,
    attribution_name character varying,
    attribution_url character varying,
    attribution_identifier character varying,
    excerpt text,
    project_id uuid,
    event_title character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    event_subtitle character varying,
    external_subject_id character varying,
    external_subject_type character varying,
    twitter_query_id uuid,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: export_targets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.export_targets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    strategy text DEFAULT 'unknown'::text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    configuration_ciphertext text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_collected_composite_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_composite_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    collectable_type character varying NOT NULL,
    collectable_id uuid NOT NULL,
    project_id uuid,
    user_collected_project_id uuid,
    user_collected_resource_id uuid,
    user_collected_resource_collection_id uuid,
    user_collected_text_id uuid,
    collectable_jsonapi_type text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    user_collected_text_section_id uuid,
    user_collected_journal_issue_id uuid
);


--
-- Name: favorites; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.favorites AS
 SELECT user_collected_composite_entries.id,
    user_collected_composite_entries.user_id,
    user_collected_composite_entries.collectable_type AS favoritable_type,
    user_collected_composite_entries.collectable_id AS favoritable_id,
    user_collected_composite_entries.project_id,
    user_collected_composite_entries.created_at,
    user_collected_composite_entries.updated_at
   FROM public.user_collected_composite_entries;


--
-- Name: features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.features (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    header character varying,
    subheader character varying,
    body character varying,
    link_text character varying,
    link_url character varying,
    link_target character varying,
    "position" integer,
    style text DEFAULT 'dark'::text,
    hidden boolean DEFAULT false,
    creator_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    background_file_name_deprecated character varying,
    background_content_type_deprecated character varying,
    background_file_size_deprecated integer,
    background_updated_at_deprecated timestamp without time zone,
    foreground_file_name_deprecated character varying,
    foreground_content_type_deprecated character varying,
    foreground_file_size_deprecated integer,
    foreground_updated_at_deprecated timestamp without time zone,
    background_color character varying,
    foreground_color character varying,
    header_color character varying,
    layout character varying,
    foreground_top character varying,
    foreground_left character varying,
    foreground_position character varying,
    live boolean DEFAULT false,
    background_data jsonb,
    foreground_data jsonb,
    include_sign_up boolean DEFAULT false NOT NULL,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flags (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creator_id uuid,
    flaggable_id uuid,
    flaggable_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: friendly_id_slugs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.friendly_id_slugs (
    id integer NOT NULL,
    slug character varying NOT NULL,
    sluggable_id integer NOT NULL,
    sluggable_type character varying(50),
    scope character varying,
    created_at timestamp without time zone
);


--
-- Name: friendly_id_slugs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.friendly_id_slugs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: friendly_id_slugs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.friendly_id_slugs_id_seq OWNED BY public.friendly_id_slugs.id;


--
-- Name: identities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.identities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    provider text NOT NULL,
    uid text NOT NULL,
    info jsonb DEFAULT '"{}"'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: import_selection_matches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.import_selection_matches (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    import_selection_id uuid NOT NULL,
    text_section_id uuid NOT NULL,
    annotation_id uuid,
    start_char integer,
    end_char integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: import_selections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.import_selections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text_id uuid NOT NULL,
    source_text_id character varying NOT NULL,
    previous_text text,
    previous_body text,
    body text NOT NULL,
    next_body text,
    next_text text,
    matches_count integer DEFAULT 0 NOT NULL,
    comments jsonb DEFAULT '[]'::jsonb NOT NULL,
    highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
    imported_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ingestion_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ingestion_sources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text_id uuid,
    source_identifier character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    kind character varying,
    source_path text,
    attachment_file_name_deprecated character varying,
    attachment_content_type_deprecated character varying,
    attachment_file_size_deprecated integer,
    attachment_updated_at_deprecated timestamp without time zone,
    attachment_data jsonb,
    display_name text
);


--
-- Name: ingestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ingestions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    state character varying,
    log character varying[],
    strategy character varying,
    external_source_url character varying,
    ingestion_type character varying,
    creator_id uuid,
    text_id uuid,
    project_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    source_file_name character varying,
    source_content_type character varying,
    source_file_size integer,
    source_updated_at timestamp without time zone,
    source_data jsonb,
    text_section_id uuid,
    target_kind text NOT NULL
);


--
-- Name: journal_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_subjects (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    journal_id uuid NOT NULL,
    subject_id uuid NOT NULL
);


--
-- Name: journal_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.journal_subjects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: journal_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.journal_subjects_id_seq OWNED BY public.journal_subjects.id;


--
-- Name: journals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    title character varying,
    subtitle character varying,
    description text,
    instagram_id character varying,
    twitter_id character varying,
    website_url character varying,
    facebook_id character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    creator_id uuid,
    slug character varying,
    draft boolean DEFAULT true NOT NULL,
    sort_title public.citext,
    events_count integer DEFAULT 0,
    hero_data jsonb,
    hero_layout integer DEFAULT 0,
    custom_icon_data jsonb,
    social_image_data jsonb,
    social_description text,
    social_title text,
    avatar_data jsonb,
    hashtag character varying,
    image_credits text,
    avatar_color character varying DEFAULT 'primary'::character varying,
    journal_issues_count integer DEFAULT 0 NOT NULL,
    journal_volumes_count integer DEFAULT 0 NOT NULL,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    logo_data jsonb,
    hero_background_color character varying,
    show_on_homepage boolean DEFAULT false NOT NULL,
    home_page_priority integer DEFAULT 0 NOT NULL
);


--
-- Name: legacy_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legacy_favorites (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    favoritable_id uuid,
    favoritable_type character varying,
    user_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: makers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.makers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    first_name character varying,
    middle_name character varying,
    last_name character varying,
    display_name character varying,
    avatar_file_name_deprecated character varying,
    avatar_content_type_deprecated character varying,
    avatar_file_size_deprecated integer,
    avatar_updated_at_deprecated timestamp without time zone,
    suffix character varying,
    avatar_data jsonb,
    prefix character varying,
    cached_full_name character varying
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    kind character varying NOT NULL,
    frequency character varying DEFAULT 'never'::character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    title character varying,
    nav_title character varying,
    show_in_footer boolean DEFAULT false,
    show_in_header boolean DEFAULT false,
    slug character varying,
    hidden boolean DEFAULT true,
    body text,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    is_external_link boolean DEFAULT false,
    external_link text,
    open_in_new_tab boolean DEFAULT false,
    creator_id uuid,
    purpose character varying DEFAULT 'supplemental_content'::character varying,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: pending_entitlement_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pending_entitlement_transitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pending_entitlement_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    sort_key integer NOT NULL,
    to_state character varying NOT NULL,
    metadata jsonb,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: pending_entitlements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pending_entitlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    creator_id uuid,
    entitlement_id uuid,
    user_id uuid,
    subject_type character varying NOT NULL,
    subject_id uuid NOT NULL,
    expiration text,
    expires_on date,
    name text NOT NULL,
    email public.citext NOT NULL,
    first_name text,
    last_name text,
    messages text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: permissions; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.permissions AS
 SELECT ((((ur.user_id || ':'::text) || r.resource_id) || ':'::text) || (r.resource_type)::text) AS id,
    ur.user_id,
    r.resource_id,
    r.resource_type,
    array_agg(r.name) AS role_names
   FROM (public.roles r
     JOIN public.users_roles ur ON ((ur.role_id = r.id)))
  WHERE (r.kind = 'scoped'::text)
  GROUP BY ur.user_id, r.resource_id, r.resource_type
 HAVING ((r.resource_id IS NOT NULL) AND (r.resource_type IS NOT NULL));


--
-- Name: project_collection_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_collection_subjects (
    id integer NOT NULL,
    project_collection_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_collection_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_collection_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_collection_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_collection_subjects_id_seq OWNED BY public.project_collection_subjects.id;


--
-- Name: project_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_exports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    export_kind text DEFAULT 'unknown'::text NOT NULL,
    fingerprint text NOT NULL,
    asset_data jsonb,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_export_statuses; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.project_export_statuses AS
 SELECT p.id AS project_id,
    pe.id AS project_export_id,
        CASE pe.export_kind
            WHEN 'bag_it'::text THEN (p.export_configuration @> '{"bag_it": true}'::jsonb)
            ELSE false
        END AS autoexport,
    pe.export_kind,
    pe.fingerprint AS export_fingerprint,
    (p.fingerprint = pe.fingerprint) AS current,
    (p.fingerprint <> pe.fingerprint) AS stale,
    pe.created_at AS exported_at
   FROM (public.projects p
     JOIN public.project_exports pe ON ((p.id = pe.project_id)));


--
-- Name: project_exportation_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_exportation_transitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    to_state text NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_key integer NOT NULL,
    project_exportation_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_exportations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_exportations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    project_id uuid NOT NULL,
    export_target_id uuid NOT NULL,
    project_export_id uuid,
    user_id uuid,
    exported_at timestamp without time zone,
    logs jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: project_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project_subjects (
    id integer NOT NULL,
    project_id uuid,
    subject_id uuid
);


--
-- Name: project_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_subjects_id_seq OWNED BY public.project_subjects.id;


--
-- Name: project_summaries; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.project_summaries AS
 SELECT p.id,
    p.id AS project_id,
    p.title,
    (p.fa_cache #>> '{title,formatted}'::text[]) AS title_formatted,
    (p.fa_cache #>> '{title,plaintext}'::text[]) AS title_plaintext,
    p.subtitle,
    (p.fa_cache #>> '{subtitle,formatted}'::text[]) AS subtitle_formatted,
    (p.fa_cache #>> '{subtitle,plaintext}'::text[]) AS subtitle_plaintext,
    p.publication_date,
    p.created_at,
    p.updated_at,
    p.slug,
    p.avatar_color,
    p.avatar_data,
    p.draft,
    p.finished,
    pm.creator_names
   FROM (public.projects p
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (public.collaborators c
             JOIN public.makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Project'::text) AND (c.collaboratable_id = p.id))) pm ON (true));


--
-- Name: reading_group_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    "position" integer,
    title text NOT NULL,
    description text NOT NULL,
    slug text NOT NULL,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reading_group_composite_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_composite_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    collectable_type character varying NOT NULL,
    collectable_id uuid NOT NULL,
    reading_group_category_id uuid,
    reading_group_project_id uuid,
    reading_group_resource_id uuid,
    reading_group_resource_collection_id uuid,
    reading_group_text_id uuid,
    collectable_jsonapi_type text NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    reading_group_text_section_id uuid,
    reading_group_journal_issue_id uuid
);


--
-- Name: reading_group_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    project_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reading_group_resource_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_resource_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    resource_collection_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reading_group_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    resource_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reading_group_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_texts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    text_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: reading_group_composite_entry_rankings; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_composite_entry_rankings AS
 SELECT rgce.id AS reading_group_composite_entry_id,
    rgce.reading_group_id,
    rgce.reading_group_category_id,
    rgce.collectable_type,
    rgce.collectable_id,
    rgce.collectable_jsonapi_type,
    rgc."position" AS category_position,
    COALESCE(rgep."position", rger."position", rgerc."position", rget."position") AS "position"
   FROM (((((public.reading_group_composite_entries rgce
     LEFT JOIN public.reading_group_categories rgc ON ((rgce.reading_group_category_id = rgc.id)))
     LEFT JOIN public.reading_group_projects rgep ON ((rgce.reading_group_project_id = rgep.id)))
     LEFT JOIN public.reading_group_resources rger ON ((rgce.reading_group_resource_id = rger.id)))
     LEFT JOIN public.reading_group_resource_collections rgerc ON ((rgce.reading_group_resource_collection_id = rgerc.id)))
     LEFT JOIN public.reading_group_texts rget ON ((rgce.reading_group_text_id = rget.id)));


--
-- Name: reading_group_collections; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_collections AS
 WITH category_type_ids AS (
         SELECT x.reading_group_id,
            COALESCE((x.reading_group_category_id)::text, '$uncategorized$'::text) AS category_id,
            x.collectable_jsonapi_type,
            jsonb_agg(x.collectable_id ORDER BY x."position") AS ids
           FROM public.reading_group_composite_entry_rankings x
          GROUP BY x.reading_group_id, COALESCE((x.reading_group_category_id)::text, '$uncategorized$'::text), x.collectable_jsonapi_type
        ), category_mappings AS (
         SELECT cti.reading_group_id,
            cti.category_id,
            jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
           FROM category_type_ids cti
          GROUP BY cti.reading_group_id, cti.category_id
        ), collection_mappings AS (
         SELECT cm_1.reading_group_id,
            jsonb_object_agg(cm_1.category_id, cm_1.mapping) AS mapping
           FROM category_mappings cm_1
          GROUP BY cm_1.reading_group_id
        ), category_lists AS (
         SELECT rgc.reading_group_id,
            jsonb_agg(jsonb_build_object('id', rgc.id, 'title', (rgc.fa_cache -> 'title'::text), 'description', (rgc.fa_cache -> 'description'::text), 'position', rgc."position") ORDER BY rgc."position") AS categories
           FROM public.reading_group_categories rgc
          GROUP BY rgc.reading_group_id
        )
 SELECT ((rg.id)::text || '-collection'::text) AS id,
    rg.id AS reading_group_id,
    COALESCE(cl.categories, '[]'::jsonb) AS categories,
    COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
   FROM ((public.reading_groups rg
     LEFT JOIN category_lists cl ON ((cl.reading_group_id = rg.id)))
     LEFT JOIN collection_mappings cm ON ((cm.reading_group_id = rg.id)));


--
-- Name: reading_group_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_counts AS
 SELECT rg.id AS reading_group_id,
    count(DISTINCT rgm.id) AS memberships_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count,
    count(DISTINCT c.id) FILTER (WHERE (NOT a.orphaned)) AS comments_count,
    count(DISTINCT c.id) FILTER (WHERE a.orphaned) AS orphaned_comments_count
   FROM (((public.reading_groups rg
     LEFT JOIN public.annotations a ON ((a.reading_group_id = rg.id)))
     LEFT JOIN public.reading_group_memberships rgm ON ((rgm.reading_group_id = rg.id)))
     LEFT JOIN public.comments c ON ((((c.subject_type)::text = 'Annotation'::text) AND (c.subject_id = a.id) AND (c.creator_id = rgm.user_id))))
  GROUP BY rg.id;


--
-- Name: reading_group_journal_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_journal_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    journal_issue_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reading_group_kinds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_kinds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reading_group_membership_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_membership_counts AS
 SELECT rgm.id AS reading_group_membership_id,
    count(DISTINCT a.id) FILTER (WHERE ((a.creator_id = rgm.user_id) AND ((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
    count(DISTINCT a.id) FILTER (WHERE ((a.creator_id = rgm.user_id) AND ((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
    count(DISTINCT a.id) FILTER (WHERE ((a.creator_id = rgm.user_id) AND ((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
    count(DISTINCT a.id) FILTER (WHERE ((a.creator_id = rgm.user_id) AND ((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count,
    count(DISTINCT c.id) FILTER (WHERE (NOT a.orphaned)) AS comments_count,
    count(DISTINCT c.id) FILTER (WHERE a.orphaned) AS orphaned_comments_count
   FROM ((public.reading_group_memberships rgm
     LEFT JOIN public.annotations a ON ((a.reading_group_id = rgm.reading_group_id)))
     LEFT JOIN public.comments c ON ((((c.subject_type)::text = 'Annotation'::text) AND (c.subject_id = a.id) AND (c.creator_id = rgm.user_id))))
  GROUP BY rgm.id;


--
-- Name: reading_group_text_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reading_group_text_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reading_group_id uuid NOT NULL,
    text_section_id uuid NOT NULL,
    reading_group_category_id uuid,
    "position" integer,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: reading_group_user_counts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_user_counts AS
 SELECT rg.id AS reading_group_id,
    rgm.user_id,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
    count(DISTINCT a.id) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count,
    count(DISTINCT c.id) FILTER (WHERE (NOT a.orphaned)) AS comments_count,
    count(DISTINCT c.id) FILTER (WHERE a.orphaned) AS orphaned_comments_count
   FROM (((public.reading_groups rg
     LEFT JOIN public.annotations a ON ((a.reading_group_id = rg.id)))
     LEFT JOIN public.reading_group_memberships rgm ON ((rgm.reading_group_id = rg.id)))
     LEFT JOIN public.comments c ON ((((c.subject_type)::text = 'Annotation'::text) AND (c.subject_id = a.id) AND (c.creator_id = rgm.user_id))))
  GROUP BY rg.id, rgm.user_id;


--
-- Name: reading_group_visibilities; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.reading_group_visibilities AS
 SELECT rg.id AS reading_group_id,
    rgm.id AS reading_group_membership_id,
    u.id AS user_id,
    rg.privacy,
    ((rgm.id IS NULL) AND ((rg.privacy)::text = 'public'::text)) AS joinable,
    ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'active'::text)) AS joined,
    ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'archived'::text)) AS archived,
    (((rgm.id IS NULL) AND ((rg.privacy)::text = 'public'::text)) OR ((rgm.id IS NOT NULL) AND (rgm.aasm_state = 'active'::text))) AS visible,
    (rg.creator_id = u.id) AS created
   FROM ((public.users u
     CROSS JOIN public.reading_groups rg)
     LEFT JOIN public.reading_group_memberships rgm ON (((rgm.reading_group_id = rg.id) AND (rgm.user_id = u.id))));


--
-- Name: resource_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_collections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying,
    description text,
    project_id uuid,
    fingerprint character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    thumbnail_file_name_deprecated character varying,
    thumbnail_content_type_deprecated character varying,
    thumbnail_file_size_deprecated integer,
    thumbnail_updated_at_deprecated timestamp without time zone,
    slug character varying,
    collection_resources_count integer DEFAULT 0,
    events_count integer DEFAULT 0,
    thumbnail_data jsonb,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: resource_import_row_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_import_row_transitions (
    id integer NOT NULL,
    to_state character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_key integer NOT NULL,
    resource_import_row_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: resource_import_row_transitions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resource_import_row_transitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resource_import_row_transitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_import_row_transitions_id_seq OWNED BY public.resource_import_row_transitions.id;


--
-- Name: resource_import_rows; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_import_rows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    resource_import_id uuid,
    resource_id uuid,
    resource_collection_id uuid,
    row_type character varying DEFAULT 'data'::character varying,
    line_number integer NOT NULL,
    "values" text[] DEFAULT '{}'::text[],
    import_errors text[] DEFAULT '{}'::text[],
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: resource_import_transitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_import_transitions (
    id integer NOT NULL,
    to_state character varying NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    sort_key integer NOT NULL,
    resource_import_id uuid NOT NULL,
    most_recent boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: resource_import_transitions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resource_import_transitions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resource_import_transitions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_import_transitions_id_seq OWNED BY public.resource_import_transitions.id;


--
-- Name: resource_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_imports (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    creator_id uuid,
    project_id uuid,
    storage_type character varying,
    storage_identifier character varying,
    source character varying NOT NULL,
    url character varying,
    header_row integer DEFAULT 1,
    column_map jsonb DEFAULT '{}'::jsonb NOT NULL,
    column_automap jsonb DEFAULT '{}'::jsonb NOT NULL,
    parse_error boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    data_file_name_deprecated character varying,
    data_content_type_deprecated character varying,
    data_file_size_deprecated integer,
    data_updated_at_deprecated timestamp without time zone,
    data_data jsonb
);


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying,
    kind character varying,
    attachment_file_name_deprecated character varying,
    attachment_content_type_deprecated character varying,
    attachment_file_size_deprecated integer,
    attachment_updated_at_deprecated timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    creator_id uuid,
    project_id uuid,
    caption text,
    description text,
    fingerprint character varying,
    external_url character varying,
    external_id character varying,
    external_type character varying,
    allow_high_res boolean DEFAULT true,
    allow_download boolean DEFAULT true,
    doi_requested boolean DEFAULT false,
    doi_added timestamp without time zone,
    high_res_file_name_deprecated character varying,
    high_res_content_type_deprecated character varying,
    high_res_file_size_deprecated integer,
    high_res_updated_at_deprecated timestamp without time zone,
    transcript_file_name_deprecated character varying,
    transcript_content_type_deprecated character varying,
    transcript_file_size_deprecated integer,
    transcript_updated_at_deprecated timestamp without time zone,
    translation_file_name_deprecated character varying,
    translation_content_type_deprecated character varying,
    translation_file_size_deprecated integer,
    translation_updated_at_deprecated timestamp without time zone,
    variant_format_one_file_name_deprecated character varying,
    variant_format_one_content_type_deprecated character varying,
    variant_format_one_file_size_deprecated integer,
    variant_format_one_updated_at_deprecated timestamp without time zone,
    variant_format_two_file_name_deprecated character varying,
    variant_format_two_content_type_deprecated character varying,
    variant_format_two_file_size_deprecated integer,
    variant_format_two_updated_at_deprecated timestamp without time zone,
    variant_thumbnail_file_name_deprecated character varying,
    variant_thumbnail_content_type_deprecated character varying,
    variant_thumbnail_file_size_deprecated integer,
    variant_thumbnail_updated_at_deprecated timestamp without time zone,
    variant_poster_file_name_deprecated character varying,
    variant_poster_content_type_deprecated character varying,
    variant_poster_file_size_deprecated integer,
    variant_poster_updated_at_deprecated timestamp without time zone,
    embed_code text,
    sub_kind character varying,
    slug character varying,
    comments_count integer DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    events_count integer DEFAULT 0,
    minimum_width character varying,
    minimum_height character varying,
    sort_title public.citext,
    attachment_data jsonb,
    high_res_data jsonb,
    transcript_data jsonb,
    translation_data jsonb,
    variant_format_one_data jsonb,
    variant_format_two_data jsonb,
    variant_thumbnail_data jsonb,
    variant_poster_data jsonb,
    pending_sort_title character varying,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    iframe_allows character varying[] DEFAULT '{fullscreen}'::character varying[] NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    general jsonb DEFAULT '{}'::jsonb,
    theme jsonb DEFAULT '{}'::jsonb,
    singleton_guard integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    press_logo_file_name_deprecated character varying,
    press_logo_content_type_deprecated character varying,
    press_logo_file_size_deprecated integer,
    press_logo_updated_at_deprecated timestamp without time zone,
    integrations jsonb DEFAULT '{}'::jsonb,
    secrets jsonb DEFAULT '{}'::jsonb,
    email jsonb DEFAULT '{}'::jsonb,
    press_logo_footer_file_name_deprecated character varying,
    press_logo_footer_content_type_deprecated character varying,
    press_logo_footer_file_size_deprecated integer,
    press_logo_footer_updated_at_deprecated timestamp without time zone,
    press_logo_mobile_file_name_deprecated character varying,
    press_logo_mobile_content_type_deprecated character varying,
    press_logo_mobile_file_size_deprecated integer,
    press_logo_mobile_updated_at_deprecated timestamp without time zone,
    press_logo_data jsonb,
    press_logo_footer_data jsonb,
    press_logo_mobile_data jsonb,
    favicon_data jsonb,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    ingestion jsonb DEFAULT '{}'::jsonb,
    rate_limiting jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: stylesheets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stylesheets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    source_identifier character varying,
    styles text,
    raw_styles text,
    text_id uuid,
    ingestion_source_id uuid,
    ingested boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    "position" integer,
    creator_id uuid,
    hashed_content character varying,
    applies_to_all_text_sections boolean DEFAULT false
);


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: system_entitlements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_entitlements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    kind text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: taggings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.taggings (
    id integer NOT NULL,
    tag_id integer,
    taggable_type character varying,
    taggable_id uuid,
    tagger_type character varying,
    tagger_id integer,
    context character varying(128),
    created_at timestamp without time zone
);


--
-- Name: taggings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.taggings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: taggings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.taggings_id_seq OWNED BY public.taggings.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying,
    taggings_count integer DEFAULT 0
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: text_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_exports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    text_id uuid NOT NULL,
    export_kind text DEFAULT 'unknown'::text NOT NULL,
    fingerprint text NOT NULL,
    asset_data jsonb,
    integrity_check jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.texts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    publication_date date,
    description character varying,
    toc_legacy text,
    page_list_legacy text,
    landmarks_legacy text,
    structure_titles_legacy text,
    project_id uuid,
    category_id uuid,
    creator_id uuid,
    start_text_section_id uuid,
    "position" integer,
    legacy_spine character varying[] DEFAULT '{}'::character varying[],
    metadata jsonb DEFAULT '{}'::jsonb,
    slug character varying,
    citations jsonb DEFAULT '{}'::jsonb,
    section_kind character varying,
    events_count integer DEFAULT 0,
    cover_data jsonb,
    published boolean DEFAULT false NOT NULL,
    fingerprint text NOT NULL,
    export_configuration jsonb DEFAULT '{}'::jsonb NOT NULL,
    ignore_access_restrictions boolean DEFAULT false,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL,
    toc jsonb DEFAULT '[]'::jsonb NOT NULL,
    page_list jsonb DEFAULT '[]'::jsonb NOT NULL,
    landmarks jsonb DEFAULT '[]'::jsonb NOT NULL,
    structure_titles jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: text_export_statuses; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.text_export_statuses AS
 SELECT t.id AS text_id,
    te.id AS text_export_id,
        CASE te.export_kind
            WHEN 'epub_v3'::text THEN (t.export_configuration @> '{"epub_v3": true}'::jsonb)
            ELSE false
        END AS autoexport,
    te.export_kind,
    te.fingerprint AS export_fingerprint,
    (t.fingerprint = te.fingerprint) AS current,
    (t.fingerprint <> te.fingerprint) AS stale,
    te.created_at AS exported_at
   FROM (public.texts t
     JOIN public.text_exports te ON ((t.id = te.text_id)));


--
-- Name: text_section_aggregations; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.text_section_aggregations AS
 SELECT text_sections.text_id,
    jsonb_agg(jsonb_build_object('label', text_sections.name, 'id', text_sections.id, 'source_path', text_sections.source_identifier, 'position', text_sections."position") ORDER BY text_sections."position") AS auto_generated_toc
   FROM public.text_sections
  GROUP BY text_sections.text_id;


--
-- Name: text_section_node_links; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.text_section_node_links AS
 SELECT parent.id AS parent_id,
    child.id AS child_id,
    parent.depth AS parent_depth,
    parent.node_index AS parent_node_index,
    child.depth AS child_depth,
    child.node_index AS child_node_index
   FROM (public.text_section_nodes parent
     JOIN public.text_section_nodes child ON (((parent.node_path OPERATOR(public.@>) child.node_path) AND (child.depth > parent.depth))));


--
-- Name: text_section_stylesheets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_section_stylesheets (
    id integer NOT NULL,
    text_section_id uuid NOT NULL,
    stylesheet_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: text_section_stylesheets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.text_section_stylesheets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: text_section_stylesheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.text_section_stylesheets_id_seq OWNED BY public.text_section_stylesheets.id;


--
-- Name: text_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_subjects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    text_id uuid,
    subject_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: text_titles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.text_titles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value character varying,
    kind character varying,
    "position" integer,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    text_id uuid,
    fa_cache jsonb DEFAULT '{}'::jsonb NOT NULL
);


--
-- Name: text_title_summaries; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.text_title_summaries AS
 SELECT text_titles.text_id,
    jsonb_object_agg(text_titles.kind, (jsonb_build_object('raw', text_titles.value) || (text_titles.fa_cache -> 'value'::text)) ORDER BY text_titles.created_at DESC) AS titles
   FROM public.text_titles
  WHERE (text_titles.kind IS NOT NULL)
  GROUP BY text_titles.text_id;


--
-- Name: text_summaries; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.text_summaries AS
 SELECT t.project_id,
    t.id,
    t.id AS text_id,
    t.created_at,
    t.updated_at,
    t.published,
    t.slug,
    t.category_id,
    t."position",
    t.description,
    (t.fa_cache #>> '{description,formatted}'::text[]) AS description_formatted,
    (t.fa_cache #>> '{description,plaintext}'::text[]) AS description_plaintext,
    t.start_text_section_id,
    t.publication_date,
    t.cover_data,
    t.toc,
    t.ignore_access_restrictions,
    tb.id AS toc_section,
    (tts.titles #>> '{subtitle,raw}'::text[]) AS subtitle,
    (tts.titles #>> '{subtitle,formatted}'::text[]) AS subtitle_formatted,
    (tts.titles #>> '{subtitle,plaintext}'::text[]) AS subtitle_plaintext,
    (tts.titles #>> '{main,raw}'::text[]) AS title,
    (tts.titles #>> '{main,formatted}'::text[]) AS title_formatted,
    (tts.titles #>> '{main,plaintext}'::text[]) AS title_plaintext,
    tts.titles,
    tm.creator_names,
    tm.collaborator_names,
    COALESCE(tac.annotations_count, (0)::bigint) AS annotations_count,
    COALESCE(tac.highlights_count, (0)::bigint) AS highlights_count,
    COALESCE(tac.orphaned_annotations_count, (0)::bigint) AS orphaned_annotations_count,
    COALESCE(tac.orphaned_highlights_count, (0)::bigint) AS orphaned_highlights_count
   FROM ((((public.texts t
     LEFT JOIN LATERAL ( SELECT count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND (NOT a.orphaned))) AS annotations_count,
            count(*) FILTER (WHERE (((a.format)::text = 'annotation'::text) AND a.orphaned)) AS orphaned_annotations_count,
            count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND (NOT a.orphaned))) AS highlights_count,
            count(*) FILTER (WHERE (((a.format)::text = 'highlight'::text) AND a.orphaned)) AS orphaned_highlights_count
           FROM (public.annotations a
             JOIN public.text_sections ts ON ((ts.id = a.text_section_id)))
          WHERE (ts.text_id = t.id)) tac ON (true))
     LEFT JOIN public.text_title_summaries tts ON ((t.id = tts.text_id)))
     LEFT JOIN LATERAL ( SELECT ts.id
           FROM public.text_sections ts
          WHERE ((ts.text_id = t.id) AND ((ts.kind)::text = 'navigation'::text))
          ORDER BY ts.created_at
         LIMIT 1) tb ON (true))
     LEFT JOIN LATERAL ( SELECT string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'creator'::text)) AS creator_names,
            string_agg((m.cached_full_name)::text, ', '::text ORDER BY c."position") FILTER (WHERE ((c.role)::text = 'collaborator'::text)) AS collaborator_names
           FROM (public.collaborators c
             JOIN public.makers m ON ((m.id = c.maker_id)))
          WHERE (((c.collaboratable_type)::text = 'Text'::text) AND (c.collaboratable_id = t.id))) tm ON (true));


--
-- Name: throttled_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.throttled_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip inet,
    email public.citext,
    matched text,
    match_type text,
    path text,
    occurrences bigint DEFAULT 0 NOT NULL,
    last_occurred_at timestamp without time zone,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: thumbnail_fetch_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.thumbnail_fetch_attempts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    successful boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0,
    reference character varying,
    resource_id uuid
);


--
-- Name: twitter_queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.twitter_queries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    project_id uuid,
    creator_id uuid,
    query character varying,
    active boolean DEFAULT true NOT NULL,
    events_count integer DEFAULT 0,
    result_type character varying DEFAULT 'most_recent'::character varying,
    most_recent_tweet_id character varying
);


--
-- Name: upgrade_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upgrade_results (
    version character varying NOT NULL,
    output text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: user_collected_journal_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_journal_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    journal_issue_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collected_projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collected_resource_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_resource_collections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    resource_collection_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collected_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    resource_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collected_text_sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_text_sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    text_section_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collected_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_collected_texts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    text_id uuid NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_collections; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_collections AS
 WITH category_type_ids AS (
         SELECT x.user_id,
            '$uncategorized$'::text AS category_id,
            x.collectable_jsonapi_type,
            jsonb_agg(x.collectable_id ORDER BY x.created_at DESC) AS ids
           FROM public.user_collected_composite_entries x
          GROUP BY x.user_id, '$uncategorized$'::text, x.collectable_jsonapi_type
        ), category_mappings AS (
         SELECT cti.user_id,
            cti.category_id,
            jsonb_object_agg(cti.collectable_jsonapi_type, cti.ids) AS mapping
           FROM category_type_ids cti
          GROUP BY cti.user_id, cti.category_id
        ), collection_mappings AS (
         SELECT cm_1.user_id,
            jsonb_object_agg(cm_1.category_id, cm_1.mapping) AS mapping
           FROM category_mappings cm_1
          GROUP BY cm_1.user_id
        )
 SELECT ((u.id)::text || '-collection'::text) AS id,
    u.id AS user_id,
    '[]'::jsonb AS categories,
    COALESCE(cm.mapping, '{}'::jsonb) AS category_mappings
   FROM (public.users u
     LEFT JOIN collection_mappings cm ON ((cm.user_id = u.id)));


--
-- Name: user_derived_roles; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_derived_roles AS
 SELECT u.id AS user_id,
    COALESCE((array_agg(r.name ORDER BY
        CASE r.name
            WHEN 'admin'::text THEN 1
            WHEN 'editor'::text THEN 2
            WHEN 'project_creator'::text THEN 3
            WHEN 'marketeer'::text THEN 4
            WHEN 'reader'::text THEN 8
            ELSE 20
        END) FILTER (WHERE (r.kind = 'global'::text)))[1], 'reader'::character varying) AS role,
    COALESCE((array_agg(r.name ORDER BY
        CASE r.name
            WHEN 'admin'::text THEN 1
            WHEN 'editor'::text THEN 2
            WHEN 'project_creator'::text THEN 3
            WHEN 'marketeer'::text THEN 4
            WHEN 'project_editor'::text THEN 5
            WHEN 'project_resource_editor'::text THEN 6
            WHEN 'project_author'::text THEN 7
            WHEN 'reader'::text THEN 8
            ELSE 20
        END) FILTER (WHERE (r.kind = ANY (ARRAY['global'::text, 'scoped'::text]))))[1], 'reader'::character varying) AS kind
   FROM ((public.users u
     LEFT JOIN public.users_roles ur ON ((ur.user_id = u.id)))
     LEFT JOIN public.roles r ON (((r.id = ur.role_id) AND (r.kind = ANY (ARRAY['global'::text, 'scoped'::text])))))
  GROUP BY u.id;


--
-- Name: version_associations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.version_associations (
    id bigint NOT NULL,
    version_id integer,
    foreign_key_name character varying NOT NULL,
    foreign_key_id integer,
    foreign_type character varying
);


--
-- Name: version_associations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.version_associations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: version_associations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.version_associations_id_seq OWNED BY public.version_associations.id;


--
-- Name: versions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.versions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    item_type character varying NOT NULL,
    item_id uuid NOT NULL,
    parent_item_type character varying,
    parent_item_id uuid,
    event character varying NOT NULL,
    whodunnit character varying,
    object jsonb,
    object_changes jsonb,
    created_at timestamp without time zone,
    transaction_id integer,
    title_fallback character varying
);


--
-- Name: entitlement_transitions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_transitions ALTER COLUMN id SET DEFAULT nextval('public.entitlement_transitions_id_seq'::regclass);


--
-- Name: friendly_id_slugs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendly_id_slugs ALTER COLUMN id SET DEFAULT nextval('public.friendly_id_slugs_id_seq'::regclass);


--
-- Name: journal_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_subjects ALTER COLUMN id SET DEFAULT nextval('public.journal_subjects_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: project_collection_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_collection_subjects ALTER COLUMN id SET DEFAULT nextval('public.project_collection_subjects_id_seq'::regclass);


--
-- Name: project_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_subjects ALTER COLUMN id SET DEFAULT nextval('public.project_subjects_id_seq'::regclass);


--
-- Name: resource_import_row_transitions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_row_transitions ALTER COLUMN id SET DEFAULT nextval('public.resource_import_row_transitions_id_seq'::regclass);


--
-- Name: resource_import_transitions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_transitions ALTER COLUMN id SET DEFAULT nextval('public.resource_import_transitions_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: taggings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taggings ALTER COLUMN id SET DEFAULT nextval('public.taggings_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: text_section_stylesheets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_section_stylesheets ALTER COLUMN id SET DEFAULT nextval('public.text_section_stylesheets_id_seq'::regclass);


--
-- Name: version_associations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version_associations ALTER COLUMN id SET DEFAULT nextval('public.version_associations_id_seq'::regclass);


--
-- Name: action_callouts action_callouts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_callouts
    ADD CONSTRAINT action_callouts_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: analytics_visits analytics_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_visits
    ADD CONSTRAINT analytics_visits_pkey PRIMARY KEY (id);


--
-- Name: annotations annotations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.annotations
    ADD CONSTRAINT annotations_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: cached_external_source_links cached_external_source_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cached_external_source_links
    ADD CONSTRAINT cached_external_source_links_pkey PRIMARY KEY (id);


--
-- Name: cached_external_sources cached_external_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cached_external_sources
    ADD CONSTRAINT cached_external_sources_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: collaborators collaborators_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaborators
    ADD CONSTRAINT collaborators_pkey PRIMARY KEY (id);


--
-- Name: collection_projects collection_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_projects
    ADD CONSTRAINT collection_projects_pkey PRIMARY KEY (id);


--
-- Name: collection_resources collection_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collection_resources
    ADD CONSTRAINT collection_resources_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: content_block_references content_block_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_block_references
    ADD CONSTRAINT content_block_references_pkey PRIMARY KEY (id);


--
-- Name: content_blocks content_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_blocks
    ADD CONSTRAINT content_blocks_pkey PRIMARY KEY (id);


--
-- Name: entitlement_import_row_transitions entitlement_import_row_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_row_transitions
    ADD CONSTRAINT entitlement_import_row_transitions_pkey PRIMARY KEY (id);


--
-- Name: entitlement_import_rows entitlement_import_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_rows
    ADD CONSTRAINT entitlement_import_rows_pkey PRIMARY KEY (id);


--
-- Name: entitlement_import_transitions entitlement_import_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_transitions
    ADD CONSTRAINT entitlement_import_transitions_pkey PRIMARY KEY (id);


--
-- Name: entitlement_imports entitlement_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_imports
    ADD CONSTRAINT entitlement_imports_pkey PRIMARY KEY (id);


--
-- Name: entitlement_roles entitlement_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_roles
    ADD CONSTRAINT entitlement_roles_pkey PRIMARY KEY (id);


--
-- Name: entitlement_transitions entitlement_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_transitions
    ADD CONSTRAINT entitlement_transitions_pkey PRIMARY KEY (id);


--
-- Name: entitlement_user_links entitlement_user_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_user_links
    ADD CONSTRAINT entitlement_user_links_pkey PRIMARY KEY (id);


--
-- Name: entitlements entitlements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlements
    ADD CONSTRAINT entitlements_pkey PRIMARY KEY (id);


--
-- Name: entitlers entitlers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlers
    ADD CONSTRAINT entitlers_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: export_targets export_targets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.export_targets
    ADD CONSTRAINT export_targets_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: flags flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flags
    ADD CONSTRAINT flags_pkey PRIMARY KEY (id);


--
-- Name: friendly_id_slugs friendly_id_slugs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.friendly_id_slugs
    ADD CONSTRAINT friendly_id_slugs_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: import_selection_matches import_selection_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selection_matches
    ADD CONSTRAINT import_selection_matches_pkey PRIMARY KEY (id);


--
-- Name: import_selections import_selections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selections
    ADD CONSTRAINT import_selections_pkey PRIMARY KEY (id);


--
-- Name: ingestion_sources ingestion_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingestion_sources
    ADD CONSTRAINT ingestion_sources_pkey PRIMARY KEY (id);


--
-- Name: ingestions ingestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingestions
    ADD CONSTRAINT ingestions_pkey PRIMARY KEY (id);


--
-- Name: journal_issues journal_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_issues
    ADD CONSTRAINT journal_issues_pkey PRIMARY KEY (id);


--
-- Name: journal_subjects journal_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_subjects
    ADD CONSTRAINT journal_subjects_pkey PRIMARY KEY (id);


--
-- Name: journal_volumes journal_volumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_volumes
    ADD CONSTRAINT journal_volumes_pkey PRIMARY KEY (id);


--
-- Name: journals journals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journals
    ADD CONSTRAINT journals_pkey PRIMARY KEY (id);


--
-- Name: legacy_favorites legacy_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legacy_favorites
    ADD CONSTRAINT legacy_favorites_pkey PRIMARY KEY (id);


--
-- Name: makers makers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.makers
    ADD CONSTRAINT makers_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pending_entitlement_transitions pending_entitlement_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlement_transitions
    ADD CONSTRAINT pending_entitlement_transitions_pkey PRIMARY KEY (id);


--
-- Name: pending_entitlements pending_entitlements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlements
    ADD CONSTRAINT pending_entitlements_pkey PRIMARY KEY (id);


--
-- Name: project_collection_subjects project_collection_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_collection_subjects
    ADD CONSTRAINT project_collection_subjects_pkey PRIMARY KEY (id);


--
-- Name: project_collections project_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_collections
    ADD CONSTRAINT project_collections_pkey PRIMARY KEY (id);


--
-- Name: project_exportation_transitions project_exportation_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportation_transitions
    ADD CONSTRAINT project_exportation_transitions_pkey PRIMARY KEY (id);


--
-- Name: project_exportations project_exportations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportations
    ADD CONSTRAINT project_exportations_pkey PRIMARY KEY (id);


--
-- Name: project_exports project_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exports
    ADD CONSTRAINT project_exports_pkey PRIMARY KEY (id);


--
-- Name: project_subjects project_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_subjects
    ADD CONSTRAINT project_subjects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: reading_group_categories reading_group_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_categories
    ADD CONSTRAINT reading_group_categories_pkey PRIMARY KEY (id);


--
-- Name: reading_group_composite_entries reading_group_composite_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT reading_group_composite_entries_pkey PRIMARY KEY (id);


--
-- Name: reading_group_journal_issues reading_group_journal_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_journal_issues
    ADD CONSTRAINT reading_group_journal_issues_pkey PRIMARY KEY (id);


--
-- Name: reading_group_kinds reading_group_kinds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_kinds
    ADD CONSTRAINT reading_group_kinds_pkey PRIMARY KEY (id);


--
-- Name: reading_group_memberships reading_group_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_memberships
    ADD CONSTRAINT reading_group_memberships_pkey PRIMARY KEY (id);


--
-- Name: reading_group_projects reading_group_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_projects
    ADD CONSTRAINT reading_group_projects_pkey PRIMARY KEY (id);


--
-- Name: reading_group_resource_collections reading_group_resource_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resource_collections
    ADD CONSTRAINT reading_group_resource_collections_pkey PRIMARY KEY (id);


--
-- Name: reading_group_resources reading_group_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resources
    ADD CONSTRAINT reading_group_resources_pkey PRIMARY KEY (id);


--
-- Name: reading_group_text_sections reading_group_text_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_text_sections
    ADD CONSTRAINT reading_group_text_sections_pkey PRIMARY KEY (id);


--
-- Name: reading_group_texts reading_group_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_texts
    ADD CONSTRAINT reading_group_texts_pkey PRIMARY KEY (id);


--
-- Name: reading_groups reading_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_groups
    ADD CONSTRAINT reading_groups_pkey PRIMARY KEY (id);


--
-- Name: resource_collections resource_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_collections
    ADD CONSTRAINT resource_collections_pkey PRIMARY KEY (id);


--
-- Name: resource_import_row_transitions resource_import_row_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_row_transitions
    ADD CONSTRAINT resource_import_row_transitions_pkey PRIMARY KEY (id);


--
-- Name: resource_import_rows resource_import_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_rows
    ADD CONSTRAINT resource_import_rows_pkey PRIMARY KEY (id);


--
-- Name: resource_import_transitions resource_import_transitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_transitions
    ADD CONSTRAINT resource_import_transitions_pkey PRIMARY KEY (id);


--
-- Name: resource_imports resource_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_imports
    ADD CONSTRAINT resource_imports_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: stylesheets stylesheets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stylesheets
    ADD CONSTRAINT stylesheets_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: system_entitlements system_entitlements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_entitlements
    ADD CONSTRAINT system_entitlements_pkey PRIMARY KEY (id);


--
-- Name: taggings taggings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.taggings
    ADD CONSTRAINT taggings_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: text_exports text_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_exports
    ADD CONSTRAINT text_exports_pkey PRIMARY KEY (id);


--
-- Name: text_section_nodes text_section_nodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_section_nodes
    ADD CONSTRAINT text_section_nodes_pkey PRIMARY KEY (id);


--
-- Name: text_section_stylesheets text_section_stylesheets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_section_stylesheets
    ADD CONSTRAINT text_section_stylesheets_pkey PRIMARY KEY (id);


--
-- Name: text_sections text_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_sections
    ADD CONSTRAINT text_sections_pkey PRIMARY KEY (id);


--
-- Name: text_subjects text_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_subjects
    ADD CONSTRAINT text_subjects_pkey PRIMARY KEY (id);


--
-- Name: text_titles text_titles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_titles
    ADD CONSTRAINT text_titles_pkey PRIMARY KEY (id);


--
-- Name: texts texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.texts
    ADD CONSTRAINT texts_pkey PRIMARY KEY (id);


--
-- Name: throttled_requests throttled_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.throttled_requests
    ADD CONSTRAINT throttled_requests_pkey PRIMARY KEY (id);


--
-- Name: thumbnail_fetch_attempts thumbnail_fetch_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.thumbnail_fetch_attempts
    ADD CONSTRAINT thumbnail_fetch_attempts_pkey PRIMARY KEY (id);


--
-- Name: twitter_queries twitter_queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.twitter_queries
    ADD CONSTRAINT twitter_queries_pkey PRIMARY KEY (id);


--
-- Name: upgrade_results upgrade_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upgrade_results
    ADD CONSTRAINT upgrade_results_pkey PRIMARY KEY (version);


--
-- Name: user_collected_composite_entries user_collected_composite_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT user_collected_composite_entries_pkey PRIMARY KEY (id);


--
-- Name: user_collected_journal_issues user_collected_journal_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_journal_issues
    ADD CONSTRAINT user_collected_journal_issues_pkey PRIMARY KEY (id);


--
-- Name: user_collected_projects user_collected_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_projects
    ADD CONSTRAINT user_collected_projects_pkey PRIMARY KEY (id);


--
-- Name: user_collected_resource_collections user_collected_resource_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resource_collections
    ADD CONSTRAINT user_collected_resource_collections_pkey PRIMARY KEY (id);


--
-- Name: user_collected_resources user_collected_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resources
    ADD CONSTRAINT user_collected_resources_pkey PRIMARY KEY (id);


--
-- Name: user_collected_text_sections user_collected_text_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_text_sections
    ADD CONSTRAINT user_collected_text_sections_pkey PRIMARY KEY (id);


--
-- Name: user_collected_texts user_collected_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_texts
    ADD CONSTRAINT user_collected_texts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: version_associations version_associations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.version_associations
    ADD CONSTRAINT version_associations_pkey PRIMARY KEY (id);


--
-- Name: versions versions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- Name: anonymous_label_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX anonymous_label_index ON public.reading_group_memberships USING btree (reading_group_id, anonymous_label);


--
-- Name: by_project_and_project_collection; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX by_project_and_project_collection ON public.collection_projects USING btree (project_id, project_collection_id);


--
-- Name: comment_anc_desc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX comment_anc_desc_idx ON public.comment_hierarchies USING btree (ancestor_id, descendant_id, generations);


--
-- Name: comment_desc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX comment_desc_idx ON public.comment_hierarchies USING btree (descendant_id);


--
-- Name: entitlement_grant_audits_pkey; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX entitlement_grant_audits_pkey ON public.entitlement_grant_audits USING btree (user_id, entitlement_role_id, resource_id, resource_type, role_name);


--
-- Name: entitlement_grants_pkey; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX entitlement_grants_pkey ON public.entitlement_grants USING btree (user_id, entitlement_role_id, resource_id, resource_type, role_name, role_kind);


--
-- Name: entitlement_user_links_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX entitlement_user_links_uniqueness ON public.entitlement_user_links USING btree (entitlement_id, user_id);


--
-- Name: index_action_callouts_on_calloutable_type_and_calloutable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_action_callouts_on_calloutable_type_and_calloutable_id ON public.action_callouts USING btree (calloutable_type, calloutable_id);


--
-- Name: index_action_callouts_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_action_callouts_on_text_id ON public.action_callouts USING btree (text_id);


--
-- Name: index_analytics_events_on_name_and_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_events_on_name_and_time ON public.analytics_events USING btree (name, "time");


--
-- Name: index_analytics_events_on_properties; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_events_on_properties ON public.analytics_events USING gin (properties jsonb_path_ops);


--
-- Name: index_analytics_events_on_visit_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_analytics_events_on_visit_id ON public.analytics_events USING btree (visit_id);


--
-- Name: index_analytics_visits_on_visit_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_analytics_visits_on_visit_token ON public.analytics_visits USING btree (visit_token);


--
-- Name: index_annotations_for_membership_counts; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_for_membership_counts ON public.annotations USING btree (id, creator_id, reading_group_id, format, orphaned);


--
-- Name: index_annotations_node_extrapolation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_node_extrapolation ON public.annotations USING btree (id, text_section_id, start_node, end_node);


--
-- Name: index_annotations_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_created_at ON public.annotations USING brin (created_at);


--
-- Name: index_annotations_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_creator_id ON public.annotations USING btree (creator_id);


--
-- Name: index_annotations_on_format; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_format ON public.annotations USING btree (format);


--
-- Name: index_annotations_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_reading_group_id ON public.annotations USING btree (reading_group_id);


--
-- Name: index_annotations_on_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_resource_id ON public.annotations USING btree (resource_id);


--
-- Name: index_annotations_on_text_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_annotations_on_text_section_id ON public.annotations USING btree (text_section_id);


--
-- Name: index_cached_external_source_link_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cached_external_source_link_uniqueness ON public.cached_external_source_links USING btree (cached_external_source_id, text_id);


--
-- Name: index_cached_external_source_links_on_cached_external_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cached_external_source_links_on_cached_external_source_id ON public.cached_external_source_links USING btree (cached_external_source_id);


--
-- Name: index_cached_external_source_links_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_cached_external_source_links_on_text_id ON public.cached_external_source_links USING btree (text_id);


--
-- Name: index_cached_external_sources_on_source_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cached_external_sources_on_source_identifier ON public.cached_external_sources USING btree (source_identifier);


--
-- Name: index_cached_external_sources_on_url; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_cached_external_sources_on_url ON public.cached_external_sources USING btree (url);


--
-- Name: index_categories_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_categories_on_project_id ON public.categories USING btree (project_id);


--
-- Name: index_collaborators_on_maker_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collaborators_on_maker_id ON public.collaborators USING btree (maker_id);


--
-- Name: index_collabs_on_collabable_type_and_collabable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collabs_on_collabable_type_and_collabable_id ON public.collaborators USING btree (collaboratable_type, collaboratable_id);


--
-- Name: index_collection_projects_on_project_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collection_projects_on_project_collection_id ON public.collection_projects USING btree (project_collection_id);


--
-- Name: index_collection_projects_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collection_projects_on_project_id ON public.collection_projects USING btree (project_id);


--
-- Name: index_collection_resources_on_resource_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collection_resources_on_resource_collection_id ON public.collection_resources USING btree (resource_collection_id);


--
-- Name: index_collection_resources_on_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_collection_resources_on_resource_id ON public.collection_resources USING btree (resource_id);


--
-- Name: index_comment_hierarchies_on_ancestor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comment_hierarchies_on_ancestor_id ON public.comment_hierarchies USING btree (ancestor_id);


--
-- Name: index_comments_on_annotations_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_annotations_by_user ON public.comments USING btree (id, subject_type, subject_id, creator_id) WHERE ((subject_type)::text = 'Annotation'::text);


--
-- Name: index_comments_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_created_at ON public.comments USING brin (created_at);


--
-- Name: index_comments_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_creator_id ON public.comments USING btree (creator_id);


--
-- Name: index_comments_on_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_parent_id ON public.comments USING btree (parent_id);


--
-- Name: index_comments_on_subject_type_and_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_subject_type_and_subject_id ON public.comments USING btree (subject_type, subject_id);


--
-- Name: index_content_block_references_on_content_block_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_content_block_references_on_content_block_id ON public.content_block_references USING btree (content_block_id);


--
-- Name: index_content_block_references_on_referencable; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_content_block_references_on_referencable ON public.content_block_references USING btree (referencable_type, referencable_id);


--
-- Name: index_content_blocks_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_content_blocks_on_project_id ON public.content_blocks USING btree (project_id);


--
-- Name: index_entitlement_grant_audits_on_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_grant_audits_on_action ON public.entitlement_grant_audits USING btree (action);


--
-- Name: index_entitlement_grants_on_entitlement_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_grants_on_entitlement_role_id ON public.entitlement_grants USING btree (entitlement_role_id);


--
-- Name: index_entitlement_grants_on_resource_type_and_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_grants_on_resource_type_and_resource_id ON public.entitlement_grants USING btree (resource_type, resource_id);


--
-- Name: index_entitlement_grants_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_grants_on_user_id ON public.entitlement_grants USING btree (user_id);


--
-- Name: index_entitlement_grants_refreshing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_grants_refreshing ON public.entitlement_grants USING btree (refreshed_at DESC, refresh_key);


--
-- Name: index_entitlement_import_row_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_import_row_transitions_parent_most_recent ON public.entitlement_import_row_transitions USING btree (entitlement_import_row_id, most_recent) WHERE most_recent;


--
-- Name: index_entitlement_import_row_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_import_row_transitions_parent_sort ON public.entitlement_import_row_transitions USING btree (entitlement_import_row_id, sort_key);


--
-- Name: index_entitlement_import_rows_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_email ON public.entitlement_import_rows USING btree (email);


--
-- Name: index_entitlement_import_rows_on_entitlement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_entitlement_id ON public.entitlement_import_rows USING btree (entitlement_id);


--
-- Name: index_entitlement_import_rows_on_entitlement_import_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_entitlement_import_id ON public.entitlement_import_rows USING btree (entitlement_import_id);


--
-- Name: index_entitlement_import_rows_on_pending_entitlement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_pending_entitlement_id ON public.entitlement_import_rows USING btree (pending_entitlement_id);


--
-- Name: index_entitlement_import_rows_on_subject_type_and_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_subject_type_and_subject_id ON public.entitlement_import_rows USING btree (subject_type, subject_id);


--
-- Name: index_entitlement_import_rows_on_target_type_and_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_on_target_type_and_target_id ON public.entitlement_import_rows USING btree (target_type, target_id);


--
-- Name: index_entitlement_import_rows_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_import_rows_ordering ON public.entitlement_import_rows USING btree (entitlement_import_id, line_number);


--
-- Name: index_entitlement_import_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_import_transitions_parent_most_recent ON public.entitlement_import_transitions USING btree (entitlement_import_id, most_recent) WHERE most_recent;


--
-- Name: index_entitlement_import_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_import_transitions_parent_sort ON public.entitlement_import_transitions USING btree (entitlement_import_id, sort_key);


--
-- Name: index_entitlement_imports_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_imports_on_creator_id ON public.entitlement_imports USING btree (creator_id);


--
-- Name: index_entitlement_roles_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_roles_on_kind ON public.entitlement_roles USING btree (kind);


--
-- Name: index_entitlement_roles_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_roles_on_name ON public.entitlement_roles USING btree (name);


--
-- Name: index_entitlement_transitions_on_entitlement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_transitions_on_entitlement_id ON public.entitlement_transitions USING btree (entitlement_id);


--
-- Name: index_entitlement_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_transitions_parent_most_recent ON public.entitlement_transitions USING btree (entitlement_id, most_recent) WHERE most_recent;


--
-- Name: index_entitlement_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlement_transitions_parent_sort ON public.entitlement_transitions USING btree (entitlement_id, sort_key);


--
-- Name: index_entitlement_user_links_on_entitlement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_user_links_on_entitlement_id ON public.entitlement_user_links USING btree (entitlement_id);


--
-- Name: index_entitlement_user_links_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlement_user_links_on_user_id ON public.entitlement_user_links USING btree (user_id);


--
-- Name: index_entitlements_on_entitler_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_entitler_id ON public.entitlements USING btree (entitler_id);


--
-- Name: index_entitlements_on_expired_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_expired_at ON public.entitlements USING btree (expired_at);


--
-- Name: index_entitlements_on_expires_on; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_expires_on ON public.entitlements USING btree (expires_on);


--
-- Name: index_entitlements_on_global_roles; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_global_roles ON public.entitlements USING gin (global_roles);


--
-- Name: index_entitlements_on_scoped_roles; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_scoped_roles ON public.entitlements USING gin (scoped_roles);


--
-- Name: index_entitlements_on_subject_type_and_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_subject_type_and_subject_id ON public.entitlements USING btree (subject_type, subject_id);


--
-- Name: index_entitlements_on_target_type_and_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_on_target_type_and_target_id ON public.entitlements USING btree (target_type, target_id);


--
-- Name: index_entitlements_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_entitlements_uniqueness ON public.entitlements USING btree (target_type, target_id, entitler_id, subject_type, subject_id);


--
-- Name: index_entitlers_entity_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_entitlers_entity_uniqueness ON public.entitlers USING btree (entity_type, entity_id);


--
-- Name: index_events_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_created_at ON public.events USING btree (created_at);


--
-- Name: index_events_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_project_id ON public.events USING btree (project_id);


--
-- Name: index_events_on_subject_type_and_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_subject_type_and_subject_id ON public.events USING btree (subject_type, subject_id);


--
-- Name: index_events_on_twitter_query_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_events_on_twitter_query_id ON public.events USING btree (twitter_query_id);


--
-- Name: index_export_targets_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_export_targets_on_slug ON public.export_targets USING btree (slug);


--
-- Name: index_export_targets_on_strategy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_export_targets_on_strategy ON public.export_targets USING btree (strategy);


--
-- Name: index_flags_on_flaggable_type_and_flaggable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_flags_on_flaggable_type_and_flaggable_id ON public.flags USING btree (flaggable_type, flaggable_id);


--
-- Name: index_friendly_id_slugs_on_slug_and_sluggable_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_friendly_id_slugs_on_slug_and_sluggable_type ON public.friendly_id_slugs USING btree (slug, sluggable_type);


--
-- Name: index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope ON public.friendly_id_slugs USING btree (slug, sluggable_type, scope);


--
-- Name: index_friendly_id_slugs_on_sluggable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_friendly_id_slugs_on_sluggable_id ON public.friendly_id_slugs USING btree (sluggable_id);


--
-- Name: index_friendly_id_slugs_on_sluggable_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_friendly_id_slugs_on_sluggable_type ON public.friendly_id_slugs USING btree (sluggable_type);


--
-- Name: index_identities_on_uid_and_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_identities_on_uid_and_provider ON public.identities USING btree (uid, provider);


--
-- Name: index_identities_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_identities_on_user_id ON public.identities USING btree (user_id);


--
-- Name: index_import_selection_matches_on_annotation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selection_matches_on_annotation_id ON public.import_selection_matches USING btree (annotation_id);


--
-- Name: index_import_selection_matches_on_import_selection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selection_matches_on_import_selection_id ON public.import_selection_matches USING btree (import_selection_id);


--
-- Name: index_import_selection_matches_on_text_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selection_matches_on_text_section_id ON public.import_selection_matches USING btree (text_section_id);


--
-- Name: index_import_selections_on_imported_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selections_on_imported_at ON public.import_selections USING btree (imported_at);


--
-- Name: index_import_selections_on_matches_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selections_on_matches_count ON public.import_selections USING btree (matches_count);


--
-- Name: index_import_selections_on_source_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selections_on_source_text_id ON public.import_selections USING btree (source_text_id);


--
-- Name: index_import_selections_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_import_selections_on_text_id ON public.import_selections USING btree (text_id);


--
-- Name: index_ingestion_sources_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestion_sources_on_kind ON public.ingestion_sources USING btree (kind);


--
-- Name: index_ingestion_sources_on_source_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestion_sources_on_source_identifier ON public.ingestion_sources USING btree (source_identifier);


--
-- Name: index_ingestion_sources_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestion_sources_on_text_id ON public.ingestion_sources USING btree (text_id);


--
-- Name: index_ingestions_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestions_on_creator_id ON public.ingestions USING btree (creator_id);


--
-- Name: index_ingestions_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestions_on_project_id ON public.ingestions USING btree (project_id);


--
-- Name: index_ingestions_on_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestions_on_state ON public.ingestions USING btree (state);


--
-- Name: index_ingestions_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestions_on_text_id ON public.ingestions USING btree (text_id);


--
-- Name: index_ingestions_on_text_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ingestions_on_text_section_id ON public.ingestions USING btree (text_section_id);


--
-- Name: index_journal_issues_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_issues_on_creator_id ON public.journal_issues USING btree (creator_id);


--
-- Name: index_journal_issues_on_journal_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_issues_on_journal_id ON public.journal_issues USING btree (journal_id);


--
-- Name: index_journal_issues_on_journal_volume_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_issues_on_journal_volume_id ON public.journal_issues USING btree (journal_volume_id);


--
-- Name: index_journal_subjects_on_journal_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_subjects_on_journal_id ON public.journal_subjects USING btree (journal_id);


--
-- Name: index_journal_subjects_on_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_subjects_on_subject_id ON public.journal_subjects USING btree (subject_id);


--
-- Name: index_journal_volumes_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_volumes_on_creator_id ON public.journal_volumes USING btree (creator_id);


--
-- Name: index_journal_volumes_on_journal_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_journal_volumes_on_journal_id ON public.journal_volumes USING btree (journal_id);


--
-- Name: index_journal_volumes_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_journal_volumes_on_slug ON public.journal_volumes USING btree (slug);


--
-- Name: index_journals_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_journals_on_slug ON public.journals USING btree (slug);


--
-- Name: index_legacy_favorites_on_favoritable_type_and_favoritable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_legacy_favorites_on_favoritable_type_and_favoritable_id ON public.legacy_favorites USING btree (favoritable_type, favoritable_id);


--
-- Name: index_legacy_favorites_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_legacy_favorites_on_user_id ON public.legacy_favorites USING btree (user_id);


--
-- Name: index_makers_sort_by_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_makers_sort_by_name ON public.makers USING btree ((((COALESCE(last_name, ''::character varying))::text || (COALESCE(first_name, ''::character varying))::text)));


--
-- Name: index_notification_preferences_on_frequency; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_preferences_on_frequency ON public.notification_preferences USING btree (frequency);


--
-- Name: index_notification_preferences_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_preferences_on_kind ON public.notification_preferences USING btree (kind);


--
-- Name: index_notification_preferences_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_notification_preferences_on_user_id ON public.notification_preferences USING btree (user_id);


--
-- Name: index_notification_preferences_on_user_id_and_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_notification_preferences_on_user_id_and_kind ON public.notification_preferences USING btree (user_id, kind);


--
-- Name: index_pages_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_pages_on_slug ON public.pages USING btree (slug);


--
-- Name: index_pending_entitlement_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_pending_entitlement_transitions_parent_most_recent ON public.pending_entitlement_transitions USING btree (pending_entitlement_id, most_recent) WHERE most_recent;


--
-- Name: index_pending_entitlement_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_pending_entitlement_transitions_parent_sort ON public.pending_entitlement_transitions USING btree (pending_entitlement_id, sort_key);


--
-- Name: index_pending_entitlements_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pending_entitlements_on_creator_id ON public.pending_entitlements USING btree (creator_id);


--
-- Name: index_pending_entitlements_on_entitlement_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pending_entitlements_on_entitlement_id ON public.pending_entitlements USING btree (entitlement_id);


--
-- Name: index_pending_entitlements_on_subject_type_and_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pending_entitlements_on_subject_type_and_subject_id ON public.pending_entitlements USING btree (subject_type, subject_id);


--
-- Name: index_pending_entitlements_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_pending_entitlements_on_user_id ON public.pending_entitlements USING btree (user_id);


--
-- Name: index_project_collection_subjects_on_project_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_collection_subjects_on_project_collection_id ON public.project_collection_subjects USING btree (project_collection_id);


--
-- Name: index_project_collection_subjects_on_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_collection_subjects_on_subject_id ON public.project_collection_subjects USING btree (subject_id);


--
-- Name: index_project_collections_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_collections_on_creator_id ON public.project_collections USING btree (creator_id);


--
-- Name: index_project_collections_on_homepage_end_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_collections_on_homepage_end_date ON public.project_collections USING btree (homepage_end_date);


--
-- Name: index_project_collections_on_homepage_start_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_collections_on_homepage_start_date ON public.project_collections USING btree (homepage_start_date);


--
-- Name: index_project_collections_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_collections_on_slug ON public.project_collections USING btree (slug);


--
-- Name: index_project_exportation_transitions_on_project_exportation_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportation_transitions_on_project_exportation_id ON public.project_exportation_transitions USING btree (project_exportation_id);


--
-- Name: index_project_exportation_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_exportation_transitions_parent_most_recent ON public.project_exportation_transitions USING btree (project_exportation_id, most_recent) WHERE most_recent;


--
-- Name: index_project_exportation_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_exportation_transitions_parent_sort ON public.project_exportation_transitions USING btree (project_exportation_id, sort_key);


--
-- Name: index_project_exportations_on_export_target_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportations_on_export_target_id ON public.project_exportations USING btree (export_target_id);


--
-- Name: index_project_exportations_on_project_export_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportations_on_project_export_id ON public.project_exportations USING btree (project_export_id);


--
-- Name: index_project_exportations_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportations_on_project_id ON public.project_exportations USING btree (project_id);


--
-- Name: index_project_exportations_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportations_on_user_id ON public.project_exportations USING btree (user_id);


--
-- Name: index_project_exportations_targeted_projects; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exportations_targeted_projects ON public.project_exportations USING btree (project_id, export_target_id);


--
-- Name: index_project_exports_on_asset_data; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exports_on_asset_data ON public.project_exports USING gin (asset_data);


--
-- Name: index_project_exports_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_exports_on_project_id ON public.project_exports USING btree (project_id);


--
-- Name: index_project_exports_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_project_exports_uniqueness ON public.project_exports USING btree (project_id, export_kind, fingerprint);


--
-- Name: index_project_subjects_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_subjects_on_project_id ON public.project_subjects USING btree (project_id);


--
-- Name: index_project_subjects_on_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_project_subjects_on_subject_id ON public.project_subjects USING btree (subject_id);


--
-- Name: index_projects_export_configuration_exports_as_bag_it; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_export_configuration_exports_as_bag_it ON public.projects USING btree (((export_configuration @> '{"bag_it": true}'::jsonb)));


--
-- Name: index_projects_on_fingerprint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_on_fingerprint ON public.projects USING btree (fingerprint);


--
-- Name: index_projects_on_journal_issue_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_projects_on_journal_issue_id ON public.projects USING btree (journal_issue_id);


--
-- Name: index_projects_on_open_access; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_on_open_access ON public.projects USING btree (open_access);


--
-- Name: index_projects_on_restricted_access; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_projects_on_restricted_access ON public.projects USING btree (restricted_access);


--
-- Name: index_projects_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_projects_on_slug ON public.projects USING btree (slug);


--
-- Name: index_reading_group_categories_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_categories_on_reading_group_id ON public.reading_group_categories USING btree (reading_group_id);


--
-- Name: index_reading_group_categories_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_categories_ordering ON public.reading_group_categories USING btree (reading_group_id, "position");


--
-- Name: index_reading_group_categories_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_categories_uniqueness ON public.reading_group_categories USING btree (reading_group_id, slug);


--
-- Name: index_reading_group_journal_issues_on_reading_group_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_journal_issues_on_reading_group_category_id ON public.reading_group_journal_issues USING btree (reading_group_category_id);


--
-- Name: index_reading_group_journal_issues_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_journal_issues_on_reading_group_id ON public.reading_group_journal_issues USING btree (reading_group_id);


--
-- Name: index_reading_group_memberships_on_aasm_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_memberships_on_aasm_state ON public.reading_group_memberships USING btree (aasm_state);


--
-- Name: index_reading_group_memberships_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_memberships_on_reading_group_id ON public.reading_group_memberships USING btree (reading_group_id);


--
-- Name: index_reading_group_memberships_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_memberships_on_user_id ON public.reading_group_memberships USING btree (user_id);


--
-- Name: index_reading_group_memberships_on_user_id_and_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_memberships_on_user_id_and_reading_group_id ON public.reading_group_memberships USING btree (user_id, reading_group_id);


--
-- Name: index_reading_group_projects_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_projects_on_project_id ON public.reading_group_projects USING btree (project_id);


--
-- Name: index_reading_group_projects_on_reading_group_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_projects_on_reading_group_category_id ON public.reading_group_projects USING btree (reading_group_category_id);


--
-- Name: index_reading_group_projects_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_projects_on_reading_group_id ON public.reading_group_projects USING btree (reading_group_id);


--
-- Name: index_reading_group_projects_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_projects_ordering ON public.reading_group_projects USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_reading_group_projects_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_projects_uniqueness ON public.reading_group_projects USING btree (reading_group_id, project_id);


--
-- Name: index_reading_group_resource_collection_category_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resource_collection_category_reference ON public.reading_group_resource_collections USING btree (reading_group_category_id);


--
-- Name: index_reading_group_resource_collection_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resource_collection_reference ON public.reading_group_resource_collections USING btree (resource_collection_id);


--
-- Name: index_reading_group_resource_collections_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resource_collections_on_reading_group_id ON public.reading_group_resource_collections USING btree (reading_group_id);


--
-- Name: index_reading_group_resource_collections_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resource_collections_ordering ON public.reading_group_resource_collections USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_reading_group_resource_collections_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_resource_collections_uniqueness ON public.reading_group_resource_collections USING btree (reading_group_id, resource_collection_id);


--
-- Name: index_reading_group_resources_on_reading_group_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resources_on_reading_group_category_id ON public.reading_group_resources USING btree (reading_group_category_id);


--
-- Name: index_reading_group_resources_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resources_on_reading_group_id ON public.reading_group_resources USING btree (reading_group_id);


--
-- Name: index_reading_group_resources_on_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resources_on_resource_id ON public.reading_group_resources USING btree (resource_id);


--
-- Name: index_reading_group_resources_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_resources_ordering ON public.reading_group_resources USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_reading_group_resources_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_resources_uniqueness ON public.reading_group_resources USING btree (reading_group_id, resource_id);


--
-- Name: index_reading_group_text_sections_on_reading_group_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_text_sections_on_reading_group_category_id ON public.reading_group_text_sections USING btree (reading_group_category_id);


--
-- Name: index_reading_group_text_sections_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_text_sections_on_reading_group_id ON public.reading_group_text_sections USING btree (reading_group_id);


--
-- Name: index_reading_group_texts_on_reading_group_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_texts_on_reading_group_category_id ON public.reading_group_texts USING btree (reading_group_category_id);


--
-- Name: index_reading_group_texts_on_reading_group_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_texts_on_reading_group_id ON public.reading_group_texts USING btree (reading_group_id);


--
-- Name: index_reading_group_texts_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_texts_on_text_id ON public.reading_group_texts USING btree (text_id);


--
-- Name: index_reading_group_texts_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_group_texts_ordering ON public.reading_group_texts USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_reading_group_texts_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_group_texts_uniqueness ON public.reading_group_texts USING btree (reading_group_id, text_id);


--
-- Name: index_reading_groups_on_course; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_groups_on_course ON public.reading_groups USING gin (course);


--
-- Name: index_reading_groups_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_groups_on_creator_id ON public.reading_groups USING btree (creator_id);


--
-- Name: index_reading_groups_on_invitation_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_reading_groups_on_invitation_code ON public.reading_groups USING btree (invitation_code);


--
-- Name: index_reading_groups_on_reading_group_kind_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_reading_groups_on_reading_group_kind_id ON public.reading_groups USING btree (reading_group_kind_id);


--
-- Name: index_resource_collections_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_collections_on_project_id ON public.resource_collections USING btree (project_id);


--
-- Name: index_resource_collections_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resource_collections_on_slug ON public.resource_collections USING btree (slug);


--
-- Name: index_resource_import_row_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resource_import_row_transitions_parent_most_recent ON public.resource_import_row_transitions USING btree (resource_import_row_id, most_recent) WHERE most_recent;


--
-- Name: index_resource_import_row_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resource_import_row_transitions_parent_sort ON public.resource_import_row_transitions USING btree (resource_import_row_id, sort_key);


--
-- Name: index_resource_import_rows_on_resource_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_import_rows_on_resource_collection_id ON public.resource_import_rows USING btree (resource_collection_id);


--
-- Name: index_resource_import_rows_on_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_import_rows_on_resource_id ON public.resource_import_rows USING btree (resource_id);


--
-- Name: index_resource_import_rows_on_resource_import_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_import_rows_on_resource_import_id ON public.resource_import_rows USING btree (resource_import_id);


--
-- Name: index_resource_import_transitions_parent_most_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resource_import_transitions_parent_most_recent ON public.resource_import_transitions USING btree (resource_import_id, most_recent) WHERE most_recent;


--
-- Name: index_resource_import_transitions_parent_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resource_import_transitions_parent_sort ON public.resource_import_transitions USING btree (resource_import_id, sort_key);


--
-- Name: index_resource_imports_on_creator_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_imports_on_creator_id ON public.resource_imports USING btree (creator_id);


--
-- Name: index_resource_imports_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resource_imports_on_project_id ON public.resource_imports USING btree (project_id);


--
-- Name: index_resources_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_resources_on_project_id ON public.resources USING btree (project_id);


--
-- Name: index_resources_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_resources_on_slug ON public.resources USING btree (slug);


--
-- Name: index_rg_journal_issue_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rg_journal_issue_reference ON public.reading_group_journal_issues USING btree (journal_issue_id);


--
-- Name: index_rg_journal_issues_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rg_journal_issues_ordering ON public.reading_group_journal_issues USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_rg_journal_issues_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_rg_journal_issues_uniqueness ON public.reading_group_journal_issues USING btree (reading_group_id, journal_issue_id);


--
-- Name: index_rg_text_section_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rg_text_section_reference ON public.reading_group_text_sections USING btree (text_section_id);


--
-- Name: index_rg_text_sections_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rg_text_sections_ordering ON public.reading_group_text_sections USING btree (reading_group_id, reading_group_category_id, "position");


--
-- Name: index_rg_text_sections_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_rg_text_sections_uniqueness ON public.reading_group_text_sections USING btree (reading_group_id, text_section_id);


--
-- Name: index_rgce_category_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_category_reference ON public.reading_group_composite_entries USING btree (reading_group_category_id);


--
-- Name: index_rgce_collectable_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_collectable_reference ON public.reading_group_composite_entries USING btree (collectable_type, collectable_id);


--
-- Name: index_rgce_journal_issue_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_journal_issue_reference ON public.reading_group_composite_entries USING btree (reading_group_journal_issue_id);


--
-- Name: index_rgce_project_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_project_reference ON public.reading_group_composite_entries USING btree (reading_group_project_id);


--
-- Name: index_rgce_reading_group_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_reading_group_reference ON public.reading_group_composite_entries USING btree (reading_group_id);


--
-- Name: index_rgce_resource_collection_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_resource_collection_reference ON public.reading_group_composite_entries USING btree (reading_group_resource_collection_id);


--
-- Name: index_rgce_resource_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_resource_reference ON public.reading_group_composite_entries USING btree (reading_group_resource_id);


--
-- Name: index_rgce_text_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_text_reference ON public.reading_group_composite_entries USING btree (reading_group_text_id);


--
-- Name: index_rgce_text_section_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_rgce_text_section_reference ON public.reading_group_composite_entries USING btree (reading_group_text_section_id);


--
-- Name: index_rgce_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_rgce_uniqueness ON public.reading_group_composite_entries USING btree (reading_group_id, collectable_type, collectable_id);


--
-- Name: index_roles_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_roles_on_kind ON public.roles USING btree (kind);


--
-- Name: index_roles_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_roles_on_name ON public.roles USING btree (name);


--
-- Name: index_roles_on_name_and_resource_type_and_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_roles_on_name_and_resource_type_and_resource_id ON public.roles USING btree (name, resource_type, resource_id);


--
-- Name: index_roles_on_resource_type_and_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_roles_on_resource_type_and_resource_id ON public.roles USING btree (resource_type, resource_id);


--
-- Name: index_settings_on_singleton_guard; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_settings_on_singleton_guard ON public.settings USING btree (singleton_guard);


--
-- Name: index_stylesheets_on_ingestion_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_stylesheets_on_ingestion_source_id ON public.stylesheets USING btree (ingestion_source_id);


--
-- Name: index_stylesheets_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_stylesheets_on_text_id ON public.stylesheets USING btree (text_id);


--
-- Name: index_subj_on_subj_type_and_subj_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_subj_on_subj_type_and_subj_id ON public.events USING btree (external_subject_type, external_subject_id);


--
-- Name: index_system_entitlements_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_system_entitlements_on_kind ON public.system_entitlements USING btree (kind);


--
-- Name: index_taggings_on_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_context ON public.taggings USING btree (context);


--
-- Name: index_taggings_on_tag_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_tag_id ON public.taggings USING btree (tag_id);


--
-- Name: index_taggings_on_taggable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_taggable_id ON public.taggings USING btree (taggable_id);


--
-- Name: index_taggings_on_taggable_id_and_taggable_type_and_context; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_taggable_id_and_taggable_type_and_context ON public.taggings USING btree (taggable_id, taggable_type, context);


--
-- Name: index_taggings_on_taggable_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_taggable_type ON public.taggings USING btree (taggable_type);


--
-- Name: index_taggings_on_taggable_type_and_taggable_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_taggable_type_and_taggable_id ON public.taggings USING btree (taggable_type, taggable_id);


--
-- Name: index_taggings_on_tagger_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_tagger_id ON public.taggings USING btree (tagger_id);


--
-- Name: index_taggings_on_tagger_id_and_tagger_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_tagger_id_and_tagger_type ON public.taggings USING btree (tagger_id, tagger_type);


--
-- Name: index_taggings_on_tagger_type_and_tagger_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_taggings_on_tagger_type_and_tagger_id ON public.taggings USING btree (tagger_type, tagger_id);


--
-- Name: index_tags_on_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_tags_on_name ON public.tags USING btree (name);


--
-- Name: index_text_exports_on_asset_data; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_exports_on_asset_data ON public.text_exports USING gin (asset_data);


--
-- Name: index_text_exports_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_exports_on_text_id ON public.text_exports USING btree (text_id);


--
-- Name: index_text_exports_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_text_exports_uniqueness ON public.text_exports USING btree (text_id, export_kind, fingerprint);


--
-- Name: index_text_section_nodes_actual_ancestors; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_actual_ancestors ON public.text_section_nodes USING gist (node_path) WHERE (NOT intermediate);


--
-- Name: index_text_section_nodes_by_id_and_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_by_id_and_hash ON public.text_section_nodes USING btree (text_section_id, body_hash);


--
-- Name: index_text_section_nodes_by_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_by_uuid ON public.text_section_nodes USING btree (text_section_id, node_uuid) INCLUDE (node_path);


--
-- Name: index_text_section_nodes_child_ordering; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_child_ordering ON public.text_section_nodes USING gist (node_path, depth, node_index);


--
-- Name: index_text_section_nodes_extrapolation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_extrapolation ON public.text_section_nodes USING btree (text_section_id, extrapolated_at);


--
-- Name: index_text_section_nodes_on_node_path; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_on_node_path ON public.text_section_nodes USING gist (node_path);


--
-- Name: index_text_section_nodes_on_text_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_on_text_section_id ON public.text_section_nodes USING btree (text_section_id);


--
-- Name: index_text_section_nodes_pairing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_nodes_pairing ON public.text_section_nodes USING btree (node_path) INCLUDE (path);


--
-- Name: index_text_section_nodes_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_text_section_nodes_uniqueness ON public.text_section_nodes USING btree (node_path);


--
-- Name: index_text_section_stylesheets_on_stylesheet_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_stylesheets_on_stylesheet_id ON public.text_section_stylesheets USING btree (stylesheet_id);


--
-- Name: index_text_section_stylesheets_on_text_section_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_section_stylesheets_on_text_section_id ON public.text_section_stylesheets USING btree (text_section_id);


--
-- Name: index_text_sections_on_extrapolated_nodes; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_sections_on_extrapolated_nodes ON public.text_sections USING btree (id, body_hash, node_root);


--
-- Name: index_text_sections_on_ingestion_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_sections_on_ingestion_source_id ON public.text_sections USING btree (ingestion_source_id);


--
-- Name: index_text_sections_on_source_identifier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_sections_on_source_identifier ON public.text_sections USING btree (source_identifier);


--
-- Name: index_text_sections_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_sections_on_text_id ON public.text_sections USING btree (text_id);


--
-- Name: index_text_sections_on_text_id_and_position; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_sections_on_text_id_and_position ON public.text_sections USING btree (text_id, "position");


--
-- Name: index_text_sections_on_text_id_and_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_text_sections_on_text_id_and_slug ON public.text_sections USING btree (text_id, slug);


--
-- Name: index_text_subjects_on_subject_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_subjects_on_subject_id ON public.text_subjects USING btree (subject_id);


--
-- Name: index_text_subjects_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_subjects_on_text_id ON public.text_subjects USING btree (text_id);


--
-- Name: index_text_titles_on_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_text_titles_on_text_id ON public.text_titles USING btree (text_id);


--
-- Name: index_texts_export_configuration_exports_as_epub_v3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_texts_export_configuration_exports_as_epub_v3 ON public.texts USING btree (((export_configuration @> '{"epub_v3": true}'::jsonb)));


--
-- Name: index_texts_on_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_texts_on_category_id ON public.texts USING btree (category_id);


--
-- Name: index_texts_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_texts_on_created_at ON public.texts USING brin (created_at);


--
-- Name: index_texts_on_fingerprint; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_texts_on_fingerprint ON public.texts USING btree (fingerprint);


--
-- Name: index_texts_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_texts_on_project_id ON public.texts USING btree (project_id);


--
-- Name: index_texts_on_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_texts_on_slug ON public.texts USING btree (slug);


--
-- Name: index_throttled_requests_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_throttled_requests_on_email ON public.throttled_requests USING btree (email);


--
-- Name: index_throttled_requests_on_ip; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_throttled_requests_on_ip ON public.throttled_requests USING btree (ip);


--
-- Name: index_throttled_requests_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_throttled_requests_uniqueness ON public.throttled_requests USING btree (ip, email, matched, match_type, path);


--
-- Name: index_thumbnail_fetch_attempts_on_resource_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_thumbnail_fetch_attempts_on_resource_id ON public.thumbnail_fetch_attempts USING btree (resource_id);


--
-- Name: index_twitter_queries_on_project_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_twitter_queries_on_project_id ON public.twitter_queries USING btree (project_id);


--
-- Name: index_uc_journal_issue_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_journal_issue_reference ON public.user_collected_journal_issues USING btree (journal_issue_id);


--
-- Name: index_uc_journal_issue_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_journal_issue_uniqueness ON public.user_collected_journal_issues USING btree (user_id, journal_issue_id);


--
-- Name: index_uc_project_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_project_reference ON public.user_collected_projects USING btree (project_id);


--
-- Name: index_uc_project_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_project_uniqueness ON public.user_collected_projects USING btree (user_id, project_id);


--
-- Name: index_uc_resource_collection_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_resource_collection_reference ON public.user_collected_resource_collections USING btree (resource_collection_id);


--
-- Name: index_uc_resource_collection_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_resource_collection_uniqueness ON public.user_collected_resource_collections USING btree (user_id, resource_collection_id);


--
-- Name: index_uc_resource_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_resource_reference ON public.user_collected_resources USING btree (resource_id);


--
-- Name: index_uc_resource_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_resource_uniqueness ON public.user_collected_resources USING btree (user_id, resource_id);


--
-- Name: index_uc_text_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_text_reference ON public.user_collected_texts USING btree (text_id);


--
-- Name: index_uc_text_section_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_uc_text_section_reference ON public.user_collected_text_sections USING btree (text_section_id);


--
-- Name: index_uc_text_section_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_text_section_uniqueness ON public.user_collected_text_sections USING btree (user_id, text_section_id);


--
-- Name: index_uc_text_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_uc_text_uniqueness ON public.user_collected_texts USING btree (user_id, text_id);


--
-- Name: index_ucce_collectable_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_collectable_reference ON public.user_collected_composite_entries USING btree (collectable_type, collectable_id);


--
-- Name: index_ucce_inferred_project_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_inferred_project_reference ON public.user_collected_composite_entries USING btree (project_id);


--
-- Name: index_ucce_journal_issue_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_journal_issue_reference ON public.user_collected_composite_entries USING btree (user_collected_journal_issue_id);


--
-- Name: index_ucce_project_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_project_reference ON public.user_collected_composite_entries USING btree (user_collected_project_id);


--
-- Name: index_ucce_resource_collection_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_resource_collection_reference ON public.user_collected_composite_entries USING btree (user_collected_resource_collection_id);


--
-- Name: index_ucce_resource_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_resource_reference ON public.user_collected_composite_entries USING btree (user_collected_resource_id);


--
-- Name: index_ucce_text_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_text_reference ON public.user_collected_composite_entries USING btree (user_collected_text_id);


--
-- Name: index_ucce_text_section_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_text_section_reference ON public.user_collected_composite_entries USING btree (user_collected_text_section_id);


--
-- Name: index_ucce_uniqueness; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_ucce_uniqueness ON public.user_collected_composite_entries USING btree (user_id, collectable_type, collectable_id);


--
-- Name: index_ucce_user_reference; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_ucce_user_reference ON public.user_collected_composite_entries USING btree (user_id);


--
-- Name: index_user_collected_journal_issues_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_journal_issues_on_user_id ON public.user_collected_journal_issues USING btree (user_id);


--
-- Name: index_user_collected_projects_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_projects_on_user_id ON public.user_collected_projects USING btree (user_id);


--
-- Name: index_user_collected_resource_collections_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_resource_collections_on_user_id ON public.user_collected_resource_collections USING btree (user_id);


--
-- Name: index_user_collected_resources_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_resources_on_user_id ON public.user_collected_resources USING btree (user_id);


--
-- Name: index_user_collected_text_sections_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_text_sections_on_user_id ON public.user_collected_text_sections USING btree (user_id);


--
-- Name: index_user_collected_texts_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_collected_texts_on_user_id ON public.user_collected_texts USING btree (user_id);


--
-- Name: index_users_on_email_confirmed_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_email_confirmed_at ON public.users USING btree (email_confirmed_at);


--
-- Name: index_users_on_established; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_established ON public.users USING btree (established);


--
-- Name: index_users_on_import_source_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_import_source_id ON public.users USING btree (import_source_id) WHERE (import_source_id IS NOT NULL);


--
-- Name: index_users_on_kind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_kind ON public.users USING btree (kind);


--
-- Name: index_users_on_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_role ON public.users USING btree (role);


--
-- Name: index_users_on_trusted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_trusted ON public.users USING btree (trusted);


--
-- Name: index_users_roles_on_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_roles_on_role_id ON public.users_roles USING btree (role_id);


--
-- Name: index_users_roles_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_roles_on_user_id ON public.users_roles USING btree (user_id);


--
-- Name: index_users_roles_on_user_id_and_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_roles_on_user_id_and_role_id ON public.users_roles USING btree (user_id, role_id);


--
-- Name: index_version_associations_on_foreign_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_version_associations_on_foreign_key ON public.version_associations USING btree (foreign_key_name, foreign_key_id, foreign_type);


--
-- Name: index_version_associations_on_version_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_version_associations_on_version_id ON public.version_associations USING btree (version_id);


--
-- Name: index_versions_on_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_created_at ON public.versions USING brin (created_at);


--
-- Name: index_versions_on_item_type_and_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_item_type_and_item_id ON public.versions USING btree (item_type, item_id);


--
-- Name: index_versions_on_parent_item_type_and_parent_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_parent_item_type_and_parent_item_id ON public.versions USING btree (parent_item_type, parent_item_id);


--
-- Name: index_versions_on_transaction_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_versions_on_transaction_id ON public.versions USING btree (transaction_id);


--
-- Name: project_collection_sort_orders_pkey; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX project_collection_sort_orders_pkey ON public.project_collection_sort_orders USING btree (sort_order);


--
-- Name: taggings_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX taggings_idx ON public.taggings USING btree (tag_id, taggable_id, taggable_type, context, tagger_id, tagger_type);


--
-- Name: taggings_idy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX taggings_idy ON public.taggings USING btree (taggable_id, taggable_type, tagger_id, context);


--
-- Name: udx_users_anonymous; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX udx_users_anonymous ON public.users USING btree (classification) WHERE ((classification)::text = 'anonymous'::text);


--
-- Name: udx_users_cli; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX udx_users_cli ON public.users USING btree (classification) WHERE ((classification)::text = 'command_line'::text);


--
-- Name: entitlement_user_links fk_rails_02d4c48235; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_user_links
    ADD CONSTRAINT fk_rails_02d4c48235 FOREIGN KEY (entitlement_id) REFERENCES public.entitlements(id) ON DELETE CASCADE;


--
-- Name: user_collected_resource_collections fk_rails_09910abb51; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resource_collections
    ADD CONSTRAINT fk_rails_09910abb51 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reading_group_journal_issues fk_rails_0b773fc1c2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_journal_issues
    ADD CONSTRAINT fk_rails_0b773fc1c2 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: reading_group_texts fk_rails_0cfbd9d8a7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_texts
    ADD CONSTRAINT fk_rails_0cfbd9d8a7 FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: reading_group_composite_entries fk_rails_0f7148b7ff; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_0f7148b7ff FOREIGN KEY (reading_group_text_id) REFERENCES public.reading_group_texts(id) ON DELETE CASCADE;


--
-- Name: entitlement_import_row_transitions fk_rails_121d85ff30; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_row_transitions
    ADD CONSTRAINT fk_rails_121d85ff30 FOREIGN KEY (entitlement_import_row_id) REFERENCES public.entitlement_import_rows(id) ON DELETE CASCADE;


--
-- Name: user_collected_texts fk_rails_127b46870c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_texts
    ADD CONSTRAINT fk_rails_127b46870c FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- Name: entitlement_import_transitions fk_rails_19acd61494; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_transitions
    ADD CONSTRAINT fk_rails_19acd61494 FOREIGN KEY (entitlement_import_id) REFERENCES public.entitlement_imports(id) ON DELETE CASCADE;


--
-- Name: reading_group_composite_entries fk_rails_1d5f346f19; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_1d5f346f19 FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: entitlement_grants fk_rails_1d863a790d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_grants
    ADD CONSTRAINT fk_rails_1d863a790d FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reading_group_categories fk_rails_1d8a335454; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_categories
    ADD CONSTRAINT fk_rails_1d8a335454 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: user_collected_composite_entries fk_rails_22697a8ef2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_22697a8ef2 FOREIGN KEY (user_collected_resource_id) REFERENCES public.user_collected_resources(id) ON DELETE CASCADE;


--
-- Name: user_collected_projects fk_rails_23716370fb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_projects
    ADD CONSTRAINT fk_rails_23716370fb FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: pending_entitlement_transitions fk_rails_292c17a15e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlement_transitions
    ADD CONSTRAINT fk_rails_292c17a15e FOREIGN KEY (pending_entitlement_id) REFERENCES public.pending_entitlements(id) ON DELETE CASCADE;


--
-- Name: reading_group_composite_entries fk_rails_313af69a44; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_313af69a44 FOREIGN KEY (reading_group_journal_issue_id) REFERENCES public.reading_group_journal_issues(id) ON DELETE CASCADE;


--
-- Name: reading_group_resources fk_rails_329e98b2fa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resources
    ADD CONSTRAINT fk_rails_329e98b2fa FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: reading_group_memberships fk_rails_33ca518faf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_memberships
    ADD CONSTRAINT fk_rails_33ca518faf FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: user_collected_resource_collections fk_rails_3a00963f32; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resource_collections
    ADD CONSTRAINT fk_rails_3a00963f32 FOREIGN KEY (resource_collection_id) REFERENCES public.resource_collections(id) ON DELETE CASCADE;


--
-- Name: cached_external_source_links fk_rails_407b7b6b03; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cached_external_source_links
    ADD CONSTRAINT fk_rails_407b7b6b03 FOREIGN KEY (cached_external_source_id) REFERENCES public.cached_external_sources(id) ON DELETE CASCADE;


--
-- Name: reading_group_composite_entries fk_rails_46de8771b1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_46de8771b1 FOREIGN KEY (reading_group_project_id) REFERENCES public.reading_group_projects(id) ON DELETE CASCADE;


--
-- Name: resource_imports fk_rails_479be92c8f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_imports
    ADD CONSTRAINT fk_rails_479be92c8f FOREIGN KEY (creator_id) REFERENCES public.users(id);


--
-- Name: users_roles fk_rails_4a41696df6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fk_rails_4a41696df6 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: entitlement_import_rows fk_rails_4b39db01c6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_rows
    ADD CONSTRAINT fk_rails_4b39db01c6 FOREIGN KEY (entitlement_id) REFERENCES public.entitlements(id) ON DELETE SET NULL;


--
-- Name: annotations fk_rails_4b66951387; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.annotations
    ADD CONSTRAINT fk_rails_4b66951387 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE SET NULL;


--
-- Name: reading_group_text_sections fk_rails_4d48b09fa9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_text_sections
    ADD CONSTRAINT fk_rails_4d48b09fa9 FOREIGN KEY (text_section_id) REFERENCES public.text_sections(id) ON DELETE CASCADE;


--
-- Name: import_selections fk_rails_52e35b4752; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selections
    ADD CONSTRAINT fk_rails_52e35b4752 FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- Name: entitlement_imports fk_rails_53484afa63; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_imports
    ADD CONSTRAINT fk_rails_53484afa63 FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: identities fk_rails_5373344100; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT fk_rails_5373344100 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_collected_composite_entries fk_rails_54952443a6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_54952443a6 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reading_group_resource_collections fk_rails_5548b5884a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resource_collections
    ADD CONSTRAINT fk_rails_5548b5884a FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: reading_group_resources fk_rails_5b9a9060bb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resources
    ADD CONSTRAINT fk_rails_5b9a9060bb FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: reading_group_projects fk_rails_5cbc177b8e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_projects
    ADD CONSTRAINT fk_rails_5cbc177b8e FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: reading_group_texts fk_rails_5e3f31d149; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_texts
    ADD CONSTRAINT fk_rails_5e3f31d149 FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- Name: import_selection_matches fk_rails_614cdd326b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selection_matches
    ADD CONSTRAINT fk_rails_614cdd326b FOREIGN KEY (import_selection_id) REFERENCES public.import_selections(id) ON DELETE CASCADE;


--
-- Name: reading_group_resource_collections fk_rails_6886eb29f2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resource_collections
    ADD CONSTRAINT fk_rails_6886eb29f2 FOREIGN KEY (resource_collection_id) REFERENCES public.resource_collections(id) ON DELETE CASCADE;


--
-- Name: user_collected_text_sections fk_rails_69be4117c2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_text_sections
    ADD CONSTRAINT fk_rails_69be4117c2 FOREIGN KEY (text_section_id) REFERENCES public.text_sections(id) ON DELETE CASCADE;


--
-- Name: user_collected_journal_issues fk_rails_6bbf03f6aa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_journal_issues
    ADD CONSTRAINT fk_rails_6bbf03f6aa FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_collected_composite_entries fk_rails_6cff5e8c22; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_6cff5e8c22 FOREIGN KEY (user_collected_resource_collection_id) REFERENCES public.user_collected_resource_collections(id) ON DELETE CASCADE;


--
-- Name: ingestions fk_rails_72831bbb74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingestions
    ADD CONSTRAINT fk_rails_72831bbb74 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE RESTRICT;


--
-- Name: entitlement_import_rows fk_rails_76c5851da2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_rows
    ADD CONSTRAINT fk_rails_76c5851da2 FOREIGN KEY (pending_entitlement_id) REFERENCES public.pending_entitlements(id) ON DELETE SET NULL;


--
-- Name: reading_group_composite_entries fk_rails_788df08cad; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_788df08cad FOREIGN KEY (reading_group_text_section_id) REFERENCES public.reading_group_text_sections(id) ON DELETE CASCADE;


--
-- Name: text_section_nodes fk_rails_7f8f8051f7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_section_nodes
    ADD CONSTRAINT fk_rails_7f8f8051f7 FOREIGN KEY (text_section_id) REFERENCES public.text_sections(id) ON DELETE CASCADE;


--
-- Name: reading_group_resources fk_rails_8671702d63; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resources
    ADD CONSTRAINT fk_rails_8671702d63 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: entitlement_grants fk_rails_898f2a67e6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_grants
    ADD CONSTRAINT fk_rails_898f2a67e6 FOREIGN KEY (entitlement_role_id) REFERENCES public.entitlement_roles(id) ON DELETE RESTRICT;


--
-- Name: project_exportations fk_rails_8bd0a6e3f6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportations
    ADD CONSTRAINT fk_rails_8bd0a6e3f6 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: reading_group_journal_issues fk_rails_8f8b2db847; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_journal_issues
    ADD CONSTRAINT fk_rails_8f8b2db847 FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: import_selection_matches fk_rails_92ec2a1563; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selection_matches
    ADD CONSTRAINT fk_rails_92ec2a1563 FOREIGN KEY (text_section_id) REFERENCES public.text_sections(id) ON DELETE CASCADE;


--
-- Name: user_collected_resources fk_rails_936ac48a73; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resources
    ADD CONSTRAINT fk_rails_936ac48a73 FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: user_collected_composite_entries fk_rails_949c61fcb0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_949c61fcb0 FOREIGN KEY (user_collected_text_id) REFERENCES public.user_collected_texts(id) ON DELETE CASCADE;


--
-- Name: notification_preferences fk_rails_9503aade25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT fk_rails_9503aade25 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_exportation_transitions fk_rails_998fa70de7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportation_transitions
    ADD CONSTRAINT fk_rails_998fa70de7 FOREIGN KEY (project_exportation_id) REFERENCES public.project_exportations(id) ON DELETE CASCADE;


--
-- Name: reading_groups fk_rails_9e14b43200; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_groups
    ADD CONSTRAINT fk_rails_9e14b43200 FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: user_collected_composite_entries fk_rails_9ea236644b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_9ea236644b FOREIGN KEY (user_collected_project_id) REFERENCES public.user_collected_projects(id) ON DELETE CASCADE;


--
-- Name: reading_group_text_sections fk_rails_9f00ec8fa3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_text_sections
    ADD CONSTRAINT fk_rails_9f00ec8fa3 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: ingestions fk_rails_a143919a1e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingestions
    ADD CONSTRAINT fk_rails_a143919a1e FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: cached_external_source_links fk_rails_a18136f2cc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cached_external_source_links
    ADD CONSTRAINT fk_rails_a18136f2cc FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE CASCADE;


--
-- Name: reading_group_composite_entries fk_rails_a3173bfc0a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_a3173bfc0a FOREIGN KEY (reading_group_resource_collection_id) REFERENCES public.reading_group_resource_collections(id) ON DELETE CASCADE;


--
-- Name: user_collected_projects fk_rails_a32a65f242; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_projects
    ADD CONSTRAINT fk_rails_a32a65f242 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reading_group_resource_collections fk_rails_a50507ed25; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_resource_collections
    ADD CONSTRAINT fk_rails_a50507ed25 FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: resource_imports fk_rails_ac6c5f3e00; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_imports
    ADD CONSTRAINT fk_rails_ac6c5f3e00 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: reading_group_projects fk_rails_af4c0905cb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_projects
    ADD CONSTRAINT fk_rails_af4c0905cb FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: import_selection_matches fk_rails_b3b5d1b78b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.import_selection_matches
    ADD CONSTRAINT fk_rails_b3b5d1b78b FOREIGN KEY (annotation_id) REFERENCES public.annotations(id) ON DELETE SET NULL;


--
-- Name: text_exports fk_rails_b4b71006ea; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.text_exports
    ADD CONSTRAINT fk_rails_b4b71006ea FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE RESTRICT;


--
-- Name: reading_group_projects fk_rails_b666336774; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_projects
    ADD CONSTRAINT fk_rails_b666336774 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: user_collected_resources fk_rails_b7046326cb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_resources
    ADD CONSTRAINT fk_rails_b7046326cb FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: entitlements fk_rails_c3bc2b12cc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlements
    ADD CONSTRAINT fk_rails_c3bc2b12cc FOREIGN KEY (entitler_id) REFERENCES public.entitlers(id) ON DELETE RESTRICT;


--
-- Name: user_collected_journal_issues fk_rails_c5327f5ce8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_journal_issues
    ADD CONSTRAINT fk_rails_c5327f5ce8 FOREIGN KEY (journal_issue_id) REFERENCES public.journal_issues(id) ON DELETE CASCADE;


--
-- Name: entitlement_user_links fk_rails_c63fa4df49; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_user_links
    ADD CONSTRAINT fk_rails_c63fa4df49 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ingestions fk_rails_cc79e5ae74; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingestions
    ADD CONSTRAINT fk_rails_cc79e5ae74 FOREIGN KEY (text_id) REFERENCES public.texts(id) ON DELETE SET NULL;


--
-- Name: user_collected_texts fk_rails_cca18f4200; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_texts
    ADD CONSTRAINT fk_rails_cca18f4200 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: resource_import_rows fk_rails_ceace9b188; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_rows
    ADD CONSTRAINT fk_rails_ceace9b188 FOREIGN KEY (resource_import_id) REFERENCES public.resource_imports(id) ON DELETE CASCADE;


--
-- Name: project_exportations fk_rails_cfa8ce683f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportations
    ADD CONSTRAINT fk_rails_cfa8ce683f FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: user_collected_composite_entries fk_rails_cfe56ce68a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_cfe56ce68a FOREIGN KEY (user_collected_text_section_id) REFERENCES public.user_collected_text_sections(id) ON DELETE CASCADE;


--
-- Name: pending_entitlements fk_rails_d049e4dc64; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlements
    ADD CONSTRAINT fk_rails_d049e4dc64 FOREIGN KEY (entitlement_id) REFERENCES public.entitlements(id) ON DELETE CASCADE;


--
-- Name: reading_group_text_sections fk_rails_d1285d0378; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_text_sections
    ADD CONSTRAINT fk_rails_d1285d0378 FOREIGN KEY (reading_group_category_id) REFERENCES public.reading_group_categories(id) ON DELETE SET NULL;


--
-- Name: reading_group_texts fk_rails_d242889004; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_texts
    ADD CONSTRAINT fk_rails_d242889004 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: resource_import_transitions fk_rails_d69a7cba10; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_transitions
    ADD CONSTRAINT fk_rails_d69a7cba10 FOREIGN KEY (resource_import_id) REFERENCES public.resource_imports(id);


--
-- Name: user_collected_composite_entries fk_rails_d707d8c314; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_d707d8c314 FOREIGN KEY (user_collected_journal_issue_id) REFERENCES public.user_collected_journal_issues(id) ON DELETE CASCADE;


--
-- Name: reading_groups fk_rails_df2899301b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_groups
    ADD CONSTRAINT fk_rails_df2899301b FOREIGN KEY (reading_group_kind_id) REFERENCES public.reading_group_kinds(id) ON DELETE SET NULL;


--
-- Name: user_collected_composite_entries fk_rails_e03a5be0da; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_composite_entries
    ADD CONSTRAINT fk_rails_e03a5be0da FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: user_collected_text_sections fk_rails_e3bf44e760; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_collected_text_sections
    ADD CONSTRAINT fk_rails_e3bf44e760 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_exportations fk_rails_e7048bd40f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportations
    ADD CONSTRAINT fk_rails_e7048bd40f FOREIGN KEY (export_target_id) REFERENCES public.export_targets(id) ON DELETE CASCADE;


--
-- Name: reading_group_composite_entries fk_rails_e7053ab635; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_e7053ab635 FOREIGN KEY (reading_group_id) REFERENCES public.reading_groups(id) ON DELETE CASCADE;


--
-- Name: reading_group_journal_issues fk_rails_e762144b6e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_journal_issues
    ADD CONSTRAINT fk_rails_e762144b6e FOREIGN KEY (journal_issue_id) REFERENCES public.journal_issues(id) ON DELETE CASCADE;


--
-- Name: pending_entitlements fk_rails_e9150849a9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlements
    ADD CONSTRAINT fk_rails_e9150849a9 FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: entitlement_import_rows fk_rails_eada257262; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entitlement_import_rows
    ADD CONSTRAINT fk_rails_eada257262 FOREIGN KEY (entitlement_import_id) REFERENCES public.entitlement_imports(id) ON DELETE CASCADE;


--
-- Name: users_roles fk_rails_eb7b4658f8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fk_rails_eb7b4658f8 FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: pending_entitlements fk_rails_ef7f19b8d6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pending_entitlements
    ADD CONSTRAINT fk_rails_ef7f19b8d6 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_exportations fk_rails_f11ca22b55; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exportations
    ADD CONSTRAINT fk_rails_f11ca22b55 FOREIGN KEY (project_export_id) REFERENCES public.project_exports(id) ON DELETE SET NULL;


--
-- Name: reading_group_memberships fk_rails_f208cc63c1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_memberships
    ADD CONSTRAINT fk_rails_f208cc63c1 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: resource_import_row_transitions fk_rails_f2f8863b50; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_import_row_transitions
    ADD CONSTRAINT fk_rails_f2f8863b50 FOREIGN KEY (resource_import_row_id) REFERENCES public.resource_import_rows(id);


--
-- Name: project_exports fk_rails_f70a43cbba; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project_exports
    ADD CONSTRAINT fk_rails_f70a43cbba FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE RESTRICT;


--
-- Name: reading_group_composite_entries fk_rails_fd14c16beb; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reading_group_composite_entries
    ADD CONSTRAINT fk_rails_fd14c16beb FOREIGN KEY (reading_group_resource_id) REFERENCES public.reading_group_resources(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20151005200100'),
('20151005200105'),
('20151007162414'),
('20151109192408'),
('20151120195625'),
('20151126164228'),
('20151202000148'),
('20151209182138'),
('20151217174519'),
('20151218173132'),
('20151230173806'),
('20160228232735'),
('20160322153256'),
('20160511152744'),
('20160511233642'),
('20160614204914'),
('20160615005354'),
('20160915191239'),
('20161018153203'),
('20161018154421'),
('20161018201521'),
('20161020182356'),
('20161020224435'),
('20161024155913'),
('20161024183400'),
('20161024191606'),
('20161024193939'),
('20161026154719'),
('20161026161041'),
('20161026163346'),
('20161026163434'),
('20161027163107'),
('20161027175554'),
('20161104222831'),
('20161105231153'),
('20161112145302'),
('20161123014447'),
('20161202190930'),
('20161211201312'),
('20161227224627'),
('20161229203236'),
('20161229205954'),
('20170106171648'),
('20170110234653'),
('20170126191544'),
('20170131172250'),
('20170206224347'),
('20170208200747'),
('20170213172354'),
('20170213172355'),
('20170213172356'),
('20170213172357'),
('20170213172358'),
('20170213172359'),
('20170213233714'),
('20170217000641'),
('20170303234856'),
('20170307182231'),
('20170313162232'),
('20170314165538'),
('20170316185017'),
('20170316225038'),
('20170316231203'),
('20170316234542'),
('20170320182809'),
('20170320200902'),
('20170321194756'),
('20170322152031'),
('20170322212627'),
('20170329234935'),
('20170330185847'),
('20170403202550'),
('20170404222122'),
('20170406200143'),
('20170407201955'),
('20170407212731'),
('20170410182659'),
('20170414235108'),
('20170419193252'),
('20170425220220'),
('20170426230747'),
('20170503180816'),
('20170512190317'),
('20170606175305'),
('20170607190058'),
('20170609180425'),
('20170609231523'),
('20170612150126'),
('20170612204527'),
('20170714204543'),
('20170727171226'),
('20170803164607'),
('20170803195751'),
('20170803204651'),
('20170910234415'),
('20170912223135'),
('20170913144218'),
('20170914170358'),
('20170919132226'),
('20170919202122'),
('20170925190220'),
('20171103000221'),
('20171115172119'),
('20171120190035'),
('20171122213742'),
('20171128173833'),
('20171209154604'),
('20171216152125'),
('20180102232442'),
('20180113140606'),
('20180119191616'),
('20180122200740'),
('20180122200750'),
('20180124162413'),
('20180125215003'),
('20180126181358'),
('20180126230432'),
('20180202210107'),
('20180202211536'),
('20180202213000'),
('20180202214000'),
('20180209231903'),
('20180214201011'),
('20180219200744'),
('20180312192903'),
('20180329220543'),
('20180406215931'),
('20180510161730'),
('20180511173451'),
('20180525215619'),
('20180625212825'),
('20180627183445'),
('20180710155830'),
('20180711222315'),
('20180711222801'),
('20180724182553'),
('20180724210709'),
('20180725163014'),
('20180726223400'),
('20180727145952'),
('20180731223301'),
('20180809232509'),
('20180814175936'),
('20180821150400'),
('20180821160457'),
('20180824221343'),
('20180824222144'),
('20180824222219'),
('20180824222247'),
('20180824222313'),
('20180921160539'),
('20180924214439'),
('20180924214502'),
('20181019151113'),
('20181025175439'),
('20181025181234'),
('20181109165055'),
('20181112224435'),
('20181113223336'),
('20181113223412'),
('20181114164356'),
('20181114164450'),
('20181114170950'),
('20181114185600'),
('20181207201023'),
('20181208111111'),
('20190117181637'),
('20190117215354'),
('20190122232351'),
('20190122232410'),
('20190122232547'),
('20190122232712'),
('20190125203527'),
('20190125204011'),
('20190125222928'),
('20190128190055'),
('20190129201051'),
('20190201200513'),
('20190205175552'),
('20190206180103'),
('20190314125115'),
('20190426214507'),
('20190506192451'),
('20190506192655'),
('20190730220353'),
('20190808201859'),
('20190830185652'),
('20190910144954'),
('20190923205942'),
('20191025200842'),
('20191106005028'),
('20191107232807'),
('20191112221025'),
('20191115192839'),
('20191120014130'),
('20191120014230'),
('20191126185303'),
('20191127181532'),
('20191130132100'),
('20191130132659'),
('20191130212914'),
('20191209193649'),
('20191209195300'),
('20191209215334'),
('20191218221540'),
('20191220214406'),
('20191220215058'),
('20191229155846'),
('20191229172230'),
('20191229172231'),
('20191229200459'),
('20200225183511'),
('20200225183655'),
('20200225183735'),
('20200225185704'),
('20200225231521'),
('20200225231542'),
('20200225231554'),
('20200225231650'),
('20200225232558'),
('20200226094748'),
('20200226095204'),
('20200304231921'),
('20200305014032'),
('20200305023111'),
('20200319023714'),
('20200327050921'),
('20200327193955'),
('20200415231420'),
('20200416205400'),
('20200416220303'),
('20200421182131'),
('20200504201500'),
('20200512192527'),
('20200709224833'),
('20200722225133'),
('20200731180104'),
('20200806214908'),
('20200806215946'),
('20201006191008'),
('20201008203503'),
('20201207011646'),
('20201207011717'),
('20201207011750'),
('20201229202853'),
('20201229210032'),
('20201229210159'),
('20201229210214'),
('20201231001706'),
('20210127061247'),
('20210127061502'),
('20210127061532'),
('20210127061716'),
('20210127061750'),
('20210127191020'),
('20210127191036'),
('20210127191113'),
('20210203181747'),
('20210203182901'),
('20210203192954'),
('20210204223216'),
('20210204224709'),
('20210204224916'),
('20210205095130'),
('20210208103220'),
('20210310012319'),
('20210310012330'),
('20210310015102'),
('20210406161945'),
('20210408214317'),
('20210413160540'),
('20210430182454'),
('20210512053226'),
('20210608162317'),
('20210608203933'),
('20220112202835'),
('20220204185651'),
('20220214190623'),
('20220224204310'),
('20220405224056'),
('20220405230839'),
('20220405233127'),
('20220412160459'),
('20220908192014'),
('20221116211558'),
('20221117235556'),
('20221118185230'),
('20221118185842'),
('20221118191954'),
('20221118192018'),
('20221122200717'),
('20221123202620'),
('20221123205731'),
('20221206170542'),
('20221206213455'),
('20221206214829'),
('20221207002431'),
('20221207004938'),
('20221207034410'),
('20230125004558'),
('20230213143027'),
('20230213165037'),
('20230213165542'),
('20230213201744'),
('20230214172717'),
('20230313215126'),
('20230406164035'),
('20230410195543'),
('20230425172153'),
('20230519033907'),
('20230607190750'),
('20230607191531'),
('20230816233543'),
('20230817212021'),
('20230823232509'),
('20230921024546'),
('20231005175407'),
('20231010184158'),
('20231129172116'),
('20240220212417'),
('20240223163849'),
('20240327194259');


