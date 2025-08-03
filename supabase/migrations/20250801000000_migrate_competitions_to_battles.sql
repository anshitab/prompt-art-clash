-- Migrate data from competitions to battles

INSERT INTO public.battles (
    title,
    description,
    theme,
    start_time,
    end_time,
    max_participants,
    current_participants,
    status,
    created_by,
    created_at,
    updated_at
)
SELECT
    COALESCE(title, 'Untitled') AS title,
    description,
    '' AS theme, -- competitions table does not have a theme column
    starts_at AS start_time,
    ends_at AS end_time,
    100 AS max_participants,
    0 AS current_participants,
    CASE
        WHEN status IS TRUE THEN 'active'
        WHEN status IS FALSE THEN 'upcoming'
        ELSE 'upcoming'
    END AS status,
    NULL AS created_by,
    created_at,
    created_at AS updated_at
FROM public.competitions; 