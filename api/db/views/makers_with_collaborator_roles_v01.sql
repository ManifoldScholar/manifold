SELECT DISTINCT
  public.texts.id AS commentable_id,
  'text' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.display_name AS display_name,
  public.makers.id AS maker_id
FROM public.texts
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.texts.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id

UNION

SELECT DISTINCT
  public.projects.id AS commentable_id,
  'project' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.display_name AS display_name,
  public.makers.id AS maker_id
FROM public.projects
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.projects.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id

UNION

SELECT DISTINCT
  public.journals.id AS commentable_id,
  'journal' AS commentable_type,
  public.collaborators.role AS role,
  public.collaborators.id AS collaborator_id,
  public.collaborators.priority AS priority,
  public.collaborators.importance AS importance,
  public.makers.display_name AS display_name,
  public.makers.id AS maker_id
FROM public.journals
JOIN public.collaborators ON public.collaborators.collaboratable_id = public.journals.id
JOIN public.makers ON public.collaborators.maker_id = public.makers.id
