SELECT DISTINCT
  public.texts.id AS commentable_id,
  'Text' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.prefix AS prefix,
  public.makers.suffix AS suffix,
  public.makers.display_name AS display_name,
  public.makers.first_name AS first_name,
  public.makers.middle_name AS middle_name,
  public.makers.last_name AS last_name,
  public.makers.id AS maker_id
FROM public.texts
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.texts.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id

UNION

SELECT DISTINCT
  public.projects.id AS commentable_id,
  'Project' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.prefix AS prefix,
  public.makers.suffix AS suffix,
  public.makers.display_name AS display_name,
  public.makers.first_name AS first_name,
  public.makers.middle_name AS middle_name,
  public.makers.last_name AS last_name,
  public.makers.id AS maker_id
FROM public.projects
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.projects.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id

UNION

SELECT DISTINCT
  public.journals.id AS commentable_id,
  'Journal' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.prefix AS prefix,
  public.makers.suffix AS suffix,
  public.makers.display_name AS display_name,
  public.makers.first_name AS first_name,
  public.makers.middle_name AS middle_name,
  public.makers.last_name AS last_name,
  public.makers.id AS maker_id
FROM public.journals
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.journals.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id
