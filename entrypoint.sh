#!/bin/sh
# 根据环境变量生成运行时 config.js，再启动 nginx
# 使同一镜像可通过 -e VITE_API_BASE_URL=... 在运行容器时覆盖 API 地址

CONFIG_PATH="${CONFIG_PATH:-/usr/share/nginx/html/config.js}"
API_URL="${VITE_API_BASE_URL:-}"

# 生成 config.js：若未设置则写入空对象，前端会回退到构建时/默认值
if [ -n "$API_URL" ]; then
  printf 'window.__APP_RUNTIME_CONFIG__={"VITE_API_BASE_URL":"%s"};\n' "$API_URL" > "$CONFIG_PATH"
else
  echo 'window.__APP_RUNTIME_CONFIG__={};' > "$CONFIG_PATH"
fi

exec nginx -g "daemon off;"
