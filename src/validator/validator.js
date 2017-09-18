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

const index = {
    required,
    minLength
}

export default index;