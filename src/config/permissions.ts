export const ALL_PERMISSIONS = [

    // for users
    // writes roles to users
    'users:roles:write',
    // Allowed to remove a role from user
    'user:roles:deleted',


    // for roles
    'roles:write',

    // for posts
    'posts:write',
    'posts:read',
    'posts:delete',
    'post:edit-own'
] as const;
// acc -> accumulator
export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) =>{
    acc[permission] = permission;
    return acc;
},{} as Record<(typeof ALL_PERMISSIONS[number]), (typeof ALL_PERMISSIONS[number])>);

export const USER_ROLE_PERMISSIONS = [
    PERMISSIONS["posts:write"],
    PERMISSIONS["posts:read"]
];

export const SYSTEM_ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    APPLICATION_USER: "APPLICATION_USER"
};