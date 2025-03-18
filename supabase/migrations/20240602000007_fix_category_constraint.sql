-- Add a check constraint to ensure category is one of the allowed values
ALTER TABLE domains DROP CONSTRAINT IF EXISTS domains_category_check;
ALTER TABLE domains ADD CONSTRAINT domains_category_check CHECK (category IN ('general', 'finance', 'tech', 'education', 'ecommerce', 'services', 'health', 'dating'));

-- Update any existing domains with invalid categories to 'general'
UPDATE domains SET category = 'general' WHERE category NOT IN ('general', 'finance', 'tech', 'education', 'ecommerce', 'services', 'health', 'dating');
