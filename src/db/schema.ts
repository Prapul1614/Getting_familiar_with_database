import { pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
// uuid : universaly unique id
export const application = pgTable('applications',{
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', {length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const users = pgTable('users',{
    id: uuid('id').defaultRandom().notNull(),
    email: varchar('email', {length: 256}).notNull(),
    name: varchar('name', {length: 256}).notNull(),
    applicationId: uuid('applicationId').references(() => application.id),
    password: varchar('password', {length: 256}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (users) => {
    return{
        // cpk - composite primary key
        cpk: primaryKey(users.email, users.applicationId),
        idIndex: uniqueIndex("user_id_index").on(users.id)
    }
});

export const roles = pgTable('roles',{
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', {length: 256}).notNull(),
    applicationId: uuid('applicationId').references(() => application.id),
    permissions: text("permissions").array().$type<Array<string>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (roles) => {
    return{
        // cpk - composite primary key
        cpk: primaryKey(roles.name, roles.applicationId),
        idIndex: uniqueIndex("roles_id_index").on(roles.id)
    }
});


export const usersToRoles = pgTable('usersToRoles',{
    applicationId: uuid('applicationId').references(() => application.id).notNull(),
    roleId: uuid('roleId').references(() => roles.id).notNull(),
    userId: uuid('userId').references(() => users.id).notNull()
}, (usersToRoles) => {
    return{
        cpk: primaryKey(usersToRoles.applicationId, usersToRoles.roleId, usersToRoles.userId)
    }
});