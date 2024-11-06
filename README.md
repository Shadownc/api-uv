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