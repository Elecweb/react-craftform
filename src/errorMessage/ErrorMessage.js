

import React from 'react';

const renderErrorComp = (error,keyErr, Render, index) => {
    if(error[keyErr] && Render){
        console.log(index);
        return <Render {...error[keyErr]} key={index} />
    }
    
};
const ErrorMessage = (errorspec) => {
    return (error)=>{
        let result = [];
        if(errorspec && error){
            if(Array.isArray(errorspec)){
                errorspec.map((errspecobj, index)=>{
                    const keyErr = errspecobj.rule;
                    const ErrorComp = renderErrorComp(error,keyErr,errspecobj.render,index);
                    if(ErrorComp){
                        result = [...result, ErrorComp];
                    }
                    
                });
            }else{
                Object.keys(errorspec).map((key,index)=>{
                    const ErrorComp = renderErrorComp(error,key,errorspec[key],index);
                    if(ErrorComp){
                        result = [...result, ErrorComp];
                    }
                    
                });
            }
            

            //===================
            
        }
       
        return result.map((ErrorElement)=>{
            return ErrorElement;
        });
    };
};

export default ErrorMessage;