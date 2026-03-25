import { Currency_types, payment_modes } from "../controller/enums/expense.enum.js";

export const handle_validation_error = (err) => {
    if(err.name === "ValidationError"){
       return  Object.values(err.errors).map(val => check_error_field(val)).join(", ");
    }else{
        return 'Unknown validation error';
    }
    
};
   
const check_error_field = (err) =>{
   
    let message = 'Unknown validation error';

        if(err.kind === 'enum'){
            switch(err.path){
                case 'currency':
                    message = `Currency must be one of the values: ${Currency_types.join(", ")}`;
                    break;
                
                case 'mode':
                    message = `Mode must be either 'DEBITED' or 'CREDITED'`;
                    break;
                case 'paymentMode':
                    message = `Payment Mode must be one of the values: ${payment_modes.join(", ")}`;
                    break;
            }
        }
        else if(err.kind === 'required'){
            message = `${err.path} is required.`;
        }
        else if(err.kind === 'min'){
            message = `${err.path} should be at least ${err.properties.min}.`;
        }

    return message;
};