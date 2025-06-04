import { useEffect ,useState} from "react";

export const useLocalStorage=<T,>(key:string,initialValue:T)=>{
    const [storedValue,setStoredValue]=useState<T>(()=> {
        try{
            const item=window.localStorage.getItem(key);
            return item? JSON.parse(item):initialValue
                }
                catch(eror){
                    console.error(eror)
                    return initialValue;

                }
    });

    useEffect(()=>{
        try{
            window.localStorage.setItem(key,JSON.stringify(storedValue));
        }
        catch(eror){
            console.error(eror)
           
        }
    },[key,storedValue]);

    return [storedValue,setStoredValue] as const ;
}