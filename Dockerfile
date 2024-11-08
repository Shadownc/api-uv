FROM node:18-alpine

WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install

# 构建项目
RUN npm run build

# 执行数据库迁移和初始化
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run init-db

# 启动服务
CMD ["npm", "start"] 