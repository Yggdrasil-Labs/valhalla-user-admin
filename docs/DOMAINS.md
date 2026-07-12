---
updated: 2026-07-12
---

# 业务领域划分

## 领域清单

| 领域 | 职责说明 | 代码位置 | 关键实体 |
|------|----------|----------|----------|
| 用户管理 | 用户账号的增删改查、状态管理、角色分配 | `src/pages/user/`, `src/api/modules/user.ts`, `src/types/store/user.ts` | UserInfo, CreateUserRequest, UpdateUserRequest |
| 角色管理 | 角色的增删改查、权限分配 | `src/pages/role/`, `src/api/modules/role.ts`, `src/types/store/role.ts` | Role, CreateRoleRequest, AssignRolePermissionRequest |
| 权限管理 | 权限的增删改查、API 接口绑定 | `src/pages/permission/`, `src/api/modules/permission.ts`, `src/types/store/permission.ts` | Permission, CreatePermissionRequest, AssignPermissionApiRequest |
| API 资源管理 | 后端接口资源的注册与管理 | `src/pages/api/`, `src/api/modules/api.ts`, `src/types/store/api.ts` | ApiResource, CreateApiRequest, UpdateApiRequest |
| 绑定关系 | 用户↔角色、角色↔权限、权限↔API 的多对多绑定 | `src/components/BindingDialog/`, `src/types/store/binding.ts` | BindingItem, BindingDialogProps |

## 领域间关系

```mermaid
flowchart LR
  User["用户管理"] -->|分配角色| Role["角色管理"]
  Role -->|分配权限| Permission["权限管理"]
  Permission -->|绑定接口| API["API 资源管理"]
```

RBAC 三级模型：用户 → 角色 → 权限 → API 接口。每一级通过绑定关系弹窗（BindingDialog）完成多对多关联。

## 领域通信规则

- 各领域页面独立，不存在跨页面直接调用
- 绑定关系通过 BindingDialog 组件统一处理，复用同一套弹窗逻辑
- 领域间数据通过 Store 层共享，不在组件间直接传递跨领域状态
- 所有 API 调用收敛在 `src/api/modules/` 对应文件中，页面不直接调用 API
