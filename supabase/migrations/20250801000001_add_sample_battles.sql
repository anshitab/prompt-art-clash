-- Add sample battles for testing

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
) VALUES 
(
    'Cyberpunk Art Challenge',
    'Create stunning cyberpunk-themed artwork featuring neon-lit cityscapes, futuristic technology, and dystopian aesthetics. Show us your vision of the future!',
    'Cyberpunk Cityscapes',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '7 days',
    50,
    12,
    'active',
    NULL,
    NOW(),
    NOW()
),
(
    'Fantasy Character Design',
    'Design original fantasy characters with unique personalities, magical abilities, and detailed costumes. Let your imagination run wild!',
    'Fantasy Characters',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '14 days',
    75,
    8,
    'upcoming',
    NULL,
    NOW(),
    NOW()
),
(
    'Nature Photography AI',
    'Generate breathtaking nature scenes using AI. From majestic mountains to serene forests, capture the beauty of the natural world.',
    'Natural Landscapes',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '5 days',
    100,
    25,
    'active',
    NULL,
    NOW(),
    NOW()
),
(
    'Steampunk Machinery',
    'Create intricate steampunk machinery and contraptions. Think gears, brass, steam, and Victorian-era technology with a twist.',
    'Steampunk Technology',
    NOW() + INTERVAL '1 week',
    NOW() + INTERVAL '21 days',
    60,
    3,
    'upcoming',
    NULL,
    NOW(),
    NOW()
),
(
    'Abstract Digital Art',
    'Explore the boundaries of abstract art with AI. Create mesmerizing patterns, colors, and compositions that challenge perception.',
    'Abstract Expressionism',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '2 days',
    40,
    18,
    'active',
    NULL,
    NOW(),
    NOW()
); 