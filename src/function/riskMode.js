export function riskMode(riskArray){
    try{
        const newArray = riskArray.split(', ');
        return newArray
    }catch{
        return riskArray
    }
}