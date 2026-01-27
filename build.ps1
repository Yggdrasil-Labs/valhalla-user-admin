# Docker 构建脚本 (PowerShell)
# 用于构建 valhalla-user-admin 项目的 Docker 镜像

param(
    [string]$Version = 'latest',
    [switch]$Clean = $false,
    [string]$Mode = 'production',
    [string]$ViteAppName = '',
    [string]$ViteApiBaseUrl = ''
)

# 设置编码为 UTF-8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# 错误处理
$ErrorActionPreference = "Stop"

# 默认配置
$ImageName = "ghcr.io/yggdrasil-labs/valhalla-user-admin"
$ContainerName = "valhalla-user-admin"
$Dockerfile = "Dockerfile"
$BuildContext = "."

# 打印信息函数
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# 检查 Docker 是否安装
function Test-Docker {
    try {
        $null = Get-Command docker -ErrorAction Stop
        $dockerVersion = docker --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Docker 已安装: $dockerVersion"
        } else {
            throw "Docker 命令执行失败"
        }
    } catch {
        Write-ErrorMsg "Docker 未安装，请先安装 Docker Desktop"
        exit 1
    }
}

# 检查必要文件
function Test-RequiredFiles {
    if (-not (Test-Path $Dockerfile)) {
        Write-ErrorMsg "Dockerfile 不存在: $Dockerfile"
        exit 1
    }
    
    if (-not (Test-Path "package.json")) {
        Write-ErrorMsg "package.json 不存在"
        exit 1
    }
    
    if (-not (Test-Path "nginx.conf")) {
        Write-Warn "nginx.conf 不存在，将使用默认配置"
    }
    
    Write-Info "必要文件检查通过"
}

# 清理旧镜像
function Remove-OldImages {
    if ($Clean) {
        Write-Info "清理旧镜像..."
        $oldImages = docker images "$ImageName" -q 2>&1
        if ($oldImages -and $LASTEXITCODE -eq 0) {
            $oldImages | ForEach-Object {
                docker rmi -f $_ 2>&1 | Out-Null
            }
            Write-Info "旧镜像清理完成"
        }
    }
}

# 构建镜像
function Build-Image {
    Write-Info "开始构建 Docker 镜像..."
    Write-Info "镜像名称: ${ImageName}:${Version}"
    Write-Info "构建上下文: $BuildContext"
    Write-Info "模式: $Mode"
    if ($ViteAppName) {
        Write-Info "应用名称: $ViteAppName"
    }
    if ($ViteApiBaseUrl) {
        Write-Info "API 地址: $ViteApiBaseUrl"
    }
    Write-Host ""
    
    # 构建 Docker build 命令参数
    $buildArgs = @(
        "-t", "${ImageName}:${Version}",
        "-t", "${ImageName}:latest",
        "-f", $Dockerfile,
        "--build-arg", "MODE=$Mode"
    )
    
    # 添加可选的环境变量
    if ($ViteAppName) {
        $buildArgs += "--build-arg", "VITE_APP_NAME=$ViteAppName"
    }
    if ($ViteApiBaseUrl) {
        $buildArgs += "--build-arg", "VITE_API_BASE_URL=$ViteApiBaseUrl"
    }
    
    $buildArgs += $BuildContext
    
    & docker build $buildArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Info "镜像构建成功！"
        Write-Info "镜像标签: ${ImageName}:${Version}, ${ImageName}:latest"
        Write-Host ""
        Write-Info "运行容器:"
        Write-Host "  docker run -d -p 8080:80 --name $ContainerName ${ImageName}:${Version}" -ForegroundColor Cyan
        Write-Host ""
        Write-Info "查看镜像:"
        Write-Host "  docker images $ImageName" -ForegroundColor Cyan
    } else {
        Write-ErrorMsg "镜像构建失败"
        exit 1
    }
}

# 主函数
function Main {
    Write-Host ""
    Write-Info "========================================="
    Write-Info "  Valhalla User Admin - Docker 构建"
    Write-Info "========================================="
    Write-Host ""
    
    Test-Docker
    Test-RequiredFiles
    Remove-OldImages
    Build-Image
    
    Write-Host ""
    Write-Info "构建完成！"
}

# 运行主函数
Main
