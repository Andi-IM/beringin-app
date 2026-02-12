-- Seed concepts
INSERT INTO public.concepts (id, title, description, category) VALUES
('b8757917-290d-452f-981f-f138804a9d70', 'Algoritma Pencarian', 'Konsep dasar algoritma pencarian seperti BFS dan DFS.', 'Ilmu Komputer'),
('f4b44612-a742-4839-828e-83c6fa98af4c', 'Struktur Data Stack', 'Pengantar struktur data LIFO (Last In First Out).', 'Ilmu Komputer')
ON CONFLICT (id) DO NOTHING;

-- Seed questions
INSERT INTO public.questions (concept_id, prompt, answer_criteria, type) VALUES
('b8757917-290d-452f-981f-f138804a9d70', 'Apa kepanjangan dari BFS?', 'Breadth First Search', 'flashcard'),
('f4b44612-a742-4839-828e-83c6fa98af4c', 'Apa prinsip utama dari Stack?', 'LIFO (Last In First Out)', 'flashcard')
ON CONFLICT DO NOTHING;
