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

export const same = (control_one,control_two) => {
    
        return function(){
            const control_one_val = this.controls.values[control_one];
            const control_two_val = this.controls.values[control_two];
            if(control_one_val == control_two_val){
                return false;
            }else{
                return {
                    same:{
                        [control_one]:control_one_val,
                        [control_two]:control_two_val
                    }
                }
            }
        }
        
    }

export const beTrue = (val) => {
    if(val === true){
        return false;
    }else{
        return {
            beTrue:true
        }
    }
}

export const beFalse = () => {
    if(val === false){
        return false;
    }else{
        return {
            beFalse:true
        }
    }
}

export const beTruthy = () => {
    if(val){
        return false
    }else{
        return {
            beTruthy:true
        }
    }
}

export const beFalsy = () => {
    if(!val){
        return false
    }else{
        return {
            beFalsy:true
        }
    }
}

const index = {
    required,
    minLength,
    maxLength,
    email,
    same,
    beTrue,
    beTruthy,
    beFalse,
    beFalsy
}

export default index;