import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { assignRoleTouser, createUser, getUserByEmail, getUsersByApplication } from "./users.services";
import jwt from 'jsonwebtoken'
import { logger } from "../../utils/logger";

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBody
    }>,
    reply: FastifyReply
){
    const {initialUser, ...data} = request.body;

    const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER;

    if(roleName === SYSTEM_ROLES.SUPER_ADMIN){
        const appUsers = await getUsersByApplication(data.applicationId);

        if(appUsers.length > 0){
            return reply.code(400).send({
                message: "App already has super admin",
                extensions:{
                    code: 'APPLICATION_ALREADY_SUPER_USER',
                    applicationId: data.applicationId,
                }
            });
        }
    }

    const role = await getRoleByName({
        name: roleName,
        applicationId: data.applicationId
    });

    if(!role) {
        return reply.code(404).send({ message: "Role not found" });
    }

    try{
        const user = await createUser(data);

        await assignRoleTouser({
            userId: user.id,
            roleId: role.id,
            applicationId: data.applicationId
        });

        return user;
    }catch(e){
        
    }

}

export async function loginHandler(request: FastifyRequest<{Body: LoginBody}>, reply: FastifyReply){
    const { applicationId, email, password} = request.body

    const user = await getUserByEmail({applicationId, email});

    if(!user){
        return reply.code(400).send({ message: "Invalid login"});
    }

    const token = jwt.sign({
        id: user.id,
        email,
        applicationId,
        scopes: user.permissions
    }, 'secret')

    return { token };

}

export async function assignRoleTouserHandler(request: FastifyRequest<{Body: AssignRoleToUserBody}>, reply: FastifyReply){
    // dont take application from request.body always infere it from user
    const applicationId = request.user.applicationId;
    const { userId, roleId } = request.body;

    try {
        const result = await assignRoleTouser({userId, applicationId, roleId});
        return result;    
    } catch (error) {
        logger.error(error,'error assigning role to user');
        return reply.code(400).send({message: "couldn't assign role to user"});
    }
    
}