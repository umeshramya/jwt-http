var user = require("user-groups-roles");


module.exports.routesecure = (role, url, method)=>{
    // this method retuns the route value of the  privilege in case it is present 
    // or return not in array if not present
   var privileges =  user.getRolePrivileges(role);
   for (let index = 0; index < privileges.length; index++) {
        if(url == privileges[index][0][0] && method == privileges[index][0][1]){
            return privileges[index][1]
        }
       break;
   }

}

// testing 
// user.createNewPrivileges("create user", "This creats the new", false);
// user.createNewPrivileges("delete user", "this deletes the ", false);

// user.createNewRole("admin");
// user.createNewRole("editor");

// // console.log(getAllPrivileges());//outputs all prvileges
// // console.log(getAllRoles());// outputs all roles

// user.addPrivilegeToRole("admin","create user", true);
// // user.addPrivilegeToRole("admin", "delete user", true);


// console.log(user.getRolePrivileges("admin"));


user.createNewPrivileges(["/article", "POST"], "access article", false);
user.createNewPrivileges(["/article", "GET"], "access article", false);
user.createNewPrivileges(["/article", "PUT"], "edit article", false);
user.createNewPrivileges(["/article", "DELETE"], "delete article", false);

user.createNewRole("admin");
user.createNewRole("editor");
user.createNewRole("author");
user.createNewRole("contributor");
user.createNewRole("subscriber");

user.addPrivilegeToRole("admin", ["/article", "POST"], true);
user.addPrivilegeToRole("admin", ["/article", "GET"], true);
user.addPrivilegeToRole("admin", ["/article", "PUT"], true);
user.addPrivilegeToRole("admin", ["/article", "DELETE"], true);

// user.addPrivilegeToRole("editor", ["/article", "POST"], true);
// user.addPrivilegeToRole("editor", ["/article", "GET"], true);
// user.addPrivilegeToRole("editor", ["/article", "PUT"], true);
// user.addPrivilegeToRole("editor", ["/article", "DELETE"], true);

// user.addPrivilegeToRole("author", ["/article", "POST"], true);
// user.addPrivilegeToRole("author", ["/article", "GET"], true);
// user.addPrivilegeToRole("author", ["/article", "PUT"], true);
// user.addPrivilegeToRole("author", ["/article", "DELETE"], false);


// user.addPrivilegeToRole("contributor", ["/article", "POST"], true);
// user.addPrivilegeToRole("contributor", ["/article", "GET"], true);
// user.addPrivilegeToRole("contributor", ["/article", "PUT"], false);
// user.addPrivilegeToRole("contributor", ["/article", "DELETE"], false);

// user.addPrivilegeToRole("subscriber", ["/article", "POST"], false);
// user.addPrivilegeToRole("subscriber", ["/article", "GET"], true);
// user.addPrivilegeToRole("subscriber", ["/article", "PUT"], false);
// user.addPrivilegeToRole("subscriber", ["/article", "DELETE"], false);

console.log(user.getRolePrivileges("admin"));




