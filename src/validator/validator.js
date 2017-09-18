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
                    length:val.length ? val.length : 0,
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
                maxRequired:{
                    length:val.length ? val.length : 0,
                    maxRequired
                }
            }
        }
    }
    
};

const index = {
    required,
    minLength
}

export default index;