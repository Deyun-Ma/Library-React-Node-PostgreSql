# Library Management System

这是一个使用 React、Node.js 和 PostgreSQL 构建的图书馆管理系统。

## 技术栈

- 前端：React + Vite + TailwindCSS
- 后端：Node.js + Express
- 数据库：PostgreSQL
- ORM：Drizzle ORM
- 认证：Passport.js
- 状态管理：React Query
- UI组件：Radix UI

## 环境要求

- Node.js (推荐 v18 或更高版本)
- PostgreSQL 数据库
- npm 或 yarn 包管理器

## 安装步骤

1. 克隆项目并安装依赖：
```bash
git clone [项目地址]
cd [项目目录]
npm install
```

2. 安装必要的数据库驱动：
```bash
npm install pg @types/pg
```

3. 配置环境变量：
创建 `.env` 文件在项目根目录，添加以下配置：
```
# 数据库配置
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/library_db

# 服务器配置
PORT=5000
NODE_ENV=development

# 会话配置
SESSION_SECRET=your_session_secret_key

# 其他配置
CLIENT_URL=http://localhost:5173
```

4. 创建数据库：
```sql
CREATE DATABASE library_db;
```

5. 初始化数据库：
```bash
npm run db:push
```

## 运行项目

### 开发环境

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问应用：
- 前端页面：http://localhost:5173
- API服务：http://localhost:5000

### 生产环境

1. 构建项目：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 项目结构

- `/client` - 前端 React 代码
- `/server` - 后端 Node.js 代码
- `/shared` - 前后端共享的代码（如数据库 schema）
- `/migrations` - 数据库迁移文件

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 运行生产版本
- `npm run check` - 运行 TypeScript 类型检查
- `npm run db:push` - 更新数据库 schema

## 主要功能

1. 用户管理
   - 用户注册
   - 用户登录/登出
   - 用户角色（普通用户/管理员）

2. 图书管理
   - 图书列表
   - 图书详情
   - 图书分类
   - 图书搜索

3. 借阅管理
   - 借阅图书
   - 归还图书
   - 借阅历史
   - 借阅状态跟踪

## 注意事项

1. 数据库配置
   - 确保 PostgreSQL 服务已启动
   - 确保数据库连接字符串正确
   - 首次运行前需要执行数据库迁移

2. 环境变量
   - 所有敏感信息都存储在 `.env` 文件中
   - 不要将 `.env` 文件提交到版本控制系统
   - 在生产环境中使用更安全的配置

3. 开发建议
   - 使用 VS Code 作为开发工具
   - 安装推荐的 VS Code 扩展
   - 遵循项目的代码规范

## 常见问题解决

1. 数据库连接错误
   - 检查 PostgreSQL 服务是否运行
   - 验证数据库连接字符串
   - 确认数据库用户权限

2. 依赖安装问题
   - 删除 `node_modules` 文件夹
   - 删除 `package-lock.json`
   - 重新运行 `npm install`

3. 编译错误
   - 检查 TypeScript 类型定义
   - 确保所有依赖都正确安装
   - 查看控制台错误信息

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request 