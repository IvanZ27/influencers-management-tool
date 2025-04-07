CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS influencers (
                                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS social_accounts (
                                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL
    );

INSERT INTO influencers (id, first_name, last_name) VALUES
                                                        ('11111111-1111-1111-1111-111111111111', 'Boris', 'The Blade Yurinov'),
                                                        ('22222222-2222-2222-2222-222222222222', 'Mickey', 'O''Neil'),
                                                        ('33333333-3333-3333-3333-333333333333', 'Tony', 'Bullet Tooth'),
                                                        ('44444444-4444-4444-4444-444444444444', 'Franky', 'Four-Fingers');

INSERT INTO social_accounts (influencer_id, platform, username) VALUES
                                                                    ('11111111-1111-1111-1111-111111111111', 'Instagram', 'boris_blade'),
                                                                    ('11111111-1111-1111-1111-111111111111', 'Instagram', 'boris_blade.docker'),
                                                                    ('11111111-1111-1111-1111-111111111111', 'TikTok', 'boris_blade'),

                                                                    ('22222222-2222-2222-2222-222222222222', 'TikTok', 'mickey_boxer'),

                                                                    ('33333333-3333-3333-3333-333333333333', 'Instagram', 'bullet_tooth'),
                                                                    ('33333333-3333-3333-3333-333333333333', 'TikTok', 'bullet_tooth'),

                                                                    ('44444444-4444-4444-4444-444444444444', 'Instagram', 'franky4fingers'),
                                                                    ('44444444-4444-4444-4444-444444444444', 'TikTok', 'franky4fingers'),
                                                                    ('44444444-4444-4444-4444-444444444444', 'TikTok', 'ifranky4fingers_live'),
                                                                    ('44444444-4444-4444-4444-444444444444', 'TikTok', 'franky_four_fingers_exclusive');

CREATE UNIQUE INDEX IF NOT EXISTS unique_account ON social_accounts (influencer_id, platform, username);