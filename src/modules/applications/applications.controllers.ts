import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./applications.services";
import { ALL_PERMISSIONS, SYSTEM_ROLES, USER_ROLE_PERMISSIONS } from "../../config/permissions";
import { createRole } from "../roles/roles.services";

export async function createApplicationHandler(
    request: FastifyRequest<{
        Body: CreateApplicationBody;
    }>,
    reply: FastifyReply
){
    reply; // Just addinging this line so es lint doesnt give error that defined but not used
    const {name} = request.body;

    const application = await createApplication({
        name
    });

    // instead of await we can use promise
    /*const superAdminRole = await createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: ALL_PERMISSIONS as unknown as Array<string>
    });

    const applicationUserRole = await createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS
    })*/

    const superAdminRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.SUPER_ADMIN,
        permissions: ALL_PERMISSIONS as unknown as Array<string>
    });

    const applicationUserRolePromise = createRole({
        applicationId: application.id,
        name: SYSTEM_ROLES.APPLICATION_USER,
        permissions: USER_ROLE_PERMISSIONS
    });

    const [superAdminRole, applicationUserRole] = await Promise.allSettled([
        superAdminRolePromise, applicationUserRolePromise
    ])

    if(superAdminRole.status === 'rejected'){
        throw new Error('Error while creating super admin role');
    }
    if(applicationUserRole.status === 'rejected'){
        throw new Error('Error while creating application user role');
    }

    return { application , superAdminRole: superAdminRole.value , applicationUserRole: applicationUserRole.value};
};

export async function getApplicationshandler(){
    return getApplications();
}