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
                                                        ('11111111-1111-1111-1111-111111111111', 'Alice', 'Anderson'),
                                                        ('22222222-2222-2222-2222-222222222222', 'Bob', 'Brown'),
                                                        ('33333333-3333-3333-3333-333333333333', 'Charlie', 'Chaplin'),
                                                        ('44444444-4444-4444-4444-444444444444', 'Diana', 'Davis');

INSERT INTO social_accounts (influencer_id, platform, username) VALUES
                                                                    ('11111111-1111-1111-1111-111111111111', 'Instagram', 'alice.insta1'),
                                                                    ('11111111-1111-1111-1111-111111111111', 'Instagram', 'alice.insta2'),
                                                                    ('11111111-1111-1111-1111-111111111111', 'TikTok', 'alice.tok'),

                                                                    ('22222222-2222-2222-2222-222222222222', 'TikTok', 'bob.tok'),

                                                                    ('33333333-3333-3333-3333-333333333333', 'Instagram', 'charlie.insta'),
                                                                    ('33333333-3333-3333-3333-333333333333', 'TikTok', 'charlie.tok'),

                                                                    ('44444444-4444-4444-4444-444444444444', 'Instagram', 'diana.insta'),
                                                                    ('44444444-4444-4444-4444-444444444444', 'TikTok', 'diana.tok');
