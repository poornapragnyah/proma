CREATE TABLE project_members (
project_id INT,
role ENUM('OWNER', 'MEMBER', 'MANAGER') NOT NULL,
owner_id INT,
member_id INT,
manager_id INT,
id SERIAL PRIMARY KEY,

-- Ensure only one role ID is populated per record based on the role type
CHECK (
    (role = 'OWNER' AND owner_id IS NOT NULL AND member_id IS NULL AND manager_id IS NULL) OR
    (role = 'MEMBER' AND member_id IS NOT NULL AND owner_id IS NULL AND manager_id IS NULL) OR
    (role = 'MANAGER' AND manager_id IS NOT NULL AND owner_id IS NULL AND member_id IS NULL)
),

-- Foreign key constraints based on roles
FOREIGN KEY (owner_id) REFERENCES admins(admin_id) ON DELETE CASCADE,
FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (manager_id) REFERENCES manager(manager_id) ON DELETE CASCADE,

-- Foreign key to link projects
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,

UNIQUE KEY unique_project_member (project_id, member_id) );