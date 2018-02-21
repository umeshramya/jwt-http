var user = require("user-groups-roles");

class user extends user.UserGroupsRoles{
    constructor(dbPath = "./json") {
        super(dbPath);
    }

    privilege_insert(curPrivilege,curdescription, curDefualt){
        try {
            super.privilege_insert(curPrivilege,curdescription, curDefualt);
        } catch (error) {
        
        }
    }

    role_insert(role, privileges){
        try {
            super.role_insert(role, privileges);
            
        } catch (error) {
            
        }
        
    }

    user_insert(user,role){
        try {
            super.user_insert(user,role);
        } catch (error) {
            
        }
    }


}