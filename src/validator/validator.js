export const required = (val) => {
    if(val){
        return false;
    }else{
        return {
            required:true
        }
    }
}

export const minLength = (minRequired) => {
    return (val) => {
        if(val && val.length >= minRequired){
            return false;
        }else{
            return {
                minLength:{
                    length:val ? val.length : 0,
                    minRequired
                }
            }
        }
    }
    
};

export const maxLength = (maxRequired) => {
    return (val) => {
        if(val && val.length <= maxRequired){
            return false;
        }else{
            return {
                maxLength:{
                    length:val ? val.length : 0,
                    maxRequired
                }
            }
        }
    }
    
};

export const email = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
        return false;   
    }else{
        return {
            email:{
                current:email
            }
        }   
    }
}

const index = {
    required,
    minLength,
    maxLength,
    email
}

export default index;