## Api

## 步骤
```
npx create-next-app@latest api-platform --typescript --tailwind --eslint
cd api-platform
npm install @prisma/client prisma @tremor/react --legacy-peer-deps
npx prisma init
npx prisma generate
npx prisma db push
npm install -D ts-node --legacy-peer-deps
```

## mysql
```
# 更新数据库结构
npx prisma db push

# 重新生成 Prisma Client
npx prisma generate

# 添加测试数据
npm run seed
```

## 部署步骤
```
# 1. 构建项目
npm run build

# 2. 执行数据库迁移
npx prisma migrate deploy

# 3. 初始化 API 数据
npm run init-db

# 4. 启动服务
npm start
```

## 本地初始化
```
npx prisma migrate reset --force
npx prisma generate
npx prisma migrate dev --name init
npm run init-db
```