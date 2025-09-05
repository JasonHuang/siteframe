-- 修复 RLS 策略以解决 403 权限错误

-- 删除现有的用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 重新创建用户表策略
-- 用户可以查看自己的信息，管理员可以查看所有用户信息
CREATE POLICY "Users can view profiles" ON users
    FOR SELECT USING (
        auth.uid()::text = id::text 
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- 用户可以更新自己的信息，管理员可以更新所有用户信息
CREATE POLICY "Users can update profiles" ON users
    FOR UPDATE USING (
        auth.uid()::text = id::text 
        OR EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- 管理员可以插入新用户（用于同步功能）
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'ADMIN'
        )
        OR NOT EXISTS (SELECT 1 FROM users) -- 允许第一个用户注册
    );

-- 管理员可以删除用户
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

SELECT 'RLS 策略修复完成！' as message;