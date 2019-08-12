const postg = require('./../../services/storage/postgre');
const redis = require('./../../services/storage/redis');
const ANONYMOUS_USER = {
    apiKey: 'anonymous',
    apiToken: 'anonymous'
};

class User {

    static login(options, cb) {
        const {
            email,
            password
        } = options;
        //TODO the query need to check it with the filters.
        const query = `
        SELECT 
            u.id as id, 
            u.role_id as role_id, 
            u.api_id as api_id, 
            u.api_token as api_token, 
            u.first_name as first_name, 
            u.last_name as last_name, 
            u.email as email,
            u.username as username, 
            u.password as password, 
            u.created_at as created_at, 
            u.updated_at as updated_at, 
            r.name as role_name,
            r.privacy_level as privacy_level
        FROM healthmap.user u 
        LEFT JOIN healthmap.user_role r ON r.id=u.role_id 
        WHERE email='${email}' `

        postg.querySlave(query, (error, results)=>{
            if(error){
                console.log('ERROR:',error);
                return cb({
                    statusCode: 500,
                    code: 'UE',
                    message: 'Unknow error'
                });
            }
            const users = results.rows;
            console.log('USERS:',users)

            if(!users.length){
                console.log('ERROR NOT FOUND WITH EMAIL:',email);
                return cb({
                    statusCode: 404,
                    code: 'NF',
                    message: `Not found user with email: ${email}`
                });
            }

            const user = users[0];


            if(!(user.password === password || user.password === md5(password))){
                console.log('INCORRECT PASSWORD:',email);
                console.log('INCORRECT PASSWORD:',password);
                return cb({
                    statusCode: 412,
                    code: 'PF',
                    message: `Incorrect password`
                });
            }


            const apiKey = `apikeys:api_id:${email}`;
            redis.connect()
            .hmset(apiKey, user, (error, result)=>{
                if(error){
                    console.log('ERROR:',error);
                    return cb({
                        statusCode: 500,
                        code: 'UE',
                        message: `Error saving the credentials`
                    });
                }
                cb(null, users)
            });
        });
        
    }
}

module.exports = User