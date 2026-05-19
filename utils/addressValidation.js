export const validateAddress = (data)=>{
    const errors = {}

    if(!data.name || data.name.trim().length<3){
        errors.name="Name must be atleast 3 characters"
    }
    if(!/^[0-9]{10}$/.test(data.phone)){
        errors.phone="Invalid phone number"
    }

    if(!/^[0-9]{6}$/.test(data.pincode)){
        errors.pincode = "Invalid pincode"
    }
    if(!data.city || data.city.trim().length<2){
        errors.city = "Invalid city"
    }
    if(!data.state || data.city.trim().length<2){
        errors.city = "Invalid city"
    }
    if(!data.street || data.street.trim().length<5){
        errors.street="Street too short"
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    }
 

}