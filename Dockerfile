# 多阶段构建 Dockerfile
# 阶段 1: 构建阶段
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm（使用 npm 直接安装，更可靠）
RUN npm install -g pnpm@10.26.0

# 构建参数（构建时传入）
ARG MODE=production

# 复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 pnpm 的冻结锁文件）
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建项目
RUN pnpm build -- --mode=${MODE}

# 阶段 2: 运行阶段
FROM nginx:alpine AS runner

# 复制构建产物到 nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制入口脚本（根据环境变量生成 config.js 后启动 nginx）
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 暴露端口
EXPOSE 80

# 通过 entrypoint 在启动前生成运行时 config.js
ENTRYPOINT ["/entrypoint.sh"]
