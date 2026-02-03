#!/bin/bash

# Docker 构建脚本
# 用于构建 valhalla-user-admin 项目的 Docker 镜像

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认配置
IMAGE_NAME="valhalla-user-admin"
IMAGE_PREFIX="ghcr.io/yggdrasil-labs"
FULL_IMAGE_NAME="${IMAGE_PREFIX}/${IMAGE_NAME}"
VERSION="latest"
DOCKERFILE="Dockerfile"
BUILD_CONTEXT="."

# 环境变量配置（从参数或环境变量获取）
MODE="${MODE:-production}"
VITE_APP_NAME="${VITE_APP_NAME:-}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-}"

# 解析参数
CLEAN_FLAG=""
VERSION_SET=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean|-c)
            CLEAN_FLAG="--clean"
            shift
            ;;
        --mode)
            MODE="$2"
            shift 2
            ;;
        --app-name)
            VITE_APP_NAME="$2"
            shift 2
            ;;
        --api-url)
            VITE_API_BASE_URL="$2"
            shift 2
            ;;
        *)
            if [ "$VERSION_SET" = false ]; then
                VERSION="$1"
                VERSION_SET=true
            fi
            shift
            ;;
    esac
done

# 如果没有提供版本参数，使用默认值
if [ "$VERSION_SET" = false ]; then
    VERSION="latest"
fi

# 打印信息
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    info "Docker 已安装: $(docker --version)"
}

# 检查必要文件
check_files() {
    if [ ! -f "$DOCKERFILE" ]; then
        error "Dockerfile 不存在: $DOCKERFILE"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        error "package.json 不存在"
        exit 1
    fi
    
    if [ ! -f "nginx.conf" ]; then
        warn "nginx.conf 不存在，将使用默认配置"
    fi
    
    info "必要文件检查通过"
}

# 清理旧镜像（可选）
cleanup_old_images() {
    if [ "$CLEAN_FLAG" == "--clean" ]; then
        info "清理旧镜像..."
        docker images "$FULL_IMAGE_NAME" -q | xargs -r docker rmi -f 2>/dev/null || true
    fi
}

# 构建镜像
build_image() {
    info "开始构建 Docker 镜像..."
    info "镜像名称: $FULL_IMAGE_NAME:$VERSION"
    info "构建上下文: $BUILD_CONTEXT"
    info "模式: $MODE"
    if [ -n "$VITE_APP_NAME" ]; then
        info "应用名称: $VITE_APP_NAME"
    fi
    if [ -n "$VITE_API_BASE_URL" ]; then
        info "API 地址: $VITE_API_BASE_URL"
    fi
    
    # 构建 Docker build 命令
    BUILD_CMD="docker build -t $FULL_IMAGE_NAME:$VERSION -t $FULL_IMAGE_NAME:latest -f $DOCKERFILE --build-arg MODE=$MODE"
    
    # 添加可选的环境变量
    if [ -n "$VITE_APP_NAME" ]; then
        BUILD_CMD="$BUILD_CMD --build-arg VITE_APP_NAME=$VITE_APP_NAME"
    fi
    if [ -n "$VITE_API_BASE_URL" ]; then
        BUILD_CMD="$BUILD_CMD --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL"
    fi
    
    BUILD_CMD="$BUILD_CMD $BUILD_CONTEXT"
    
    eval $BUILD_CMD
    
    if [ $? -eq 0 ]; then
        info "镜像构建成功！"
        info "镜像标签: $FULL_IMAGE_NAME:$VERSION, $FULL_IMAGE_NAME:latest"
        echo ""
        info "运行容器:"
        echo "  docker run -d -p 8080:80 --name $IMAGE_NAME $FULL_IMAGE_NAME:$VERSION"
        echo ""
        info "查看镜像:"
        echo "  docker images $FULL_IMAGE_NAME"
    else
        error "镜像构建失败"
        exit 1
    fi
}

# 主函数
main() {
    info "========================================="
    info "  Valhalla User Admin - Docker 构建"
    info "========================================="
    echo ""
    
    check_docker
    check_files
    cleanup_old_images
    build_image
    
    info "构建完成！"
}

# 运行主函数
main "$@"
