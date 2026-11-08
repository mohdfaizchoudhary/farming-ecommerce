"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import type {Session} from "@supabase/supabase-js";
import {getSupabaseClient} from "@/lib/supabase";
import {useStore} from "@/components/StoreProvider";

type AuthContextValue={session:Session|null;loading:boolean;configured:boolean;authError:string};
const AuthContext=createContext<AuthContextValue|null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){
  const{upsertCustomer}=useStore();
  const[session,setSession]=useState<Session|null>(null);
  const[loading,setLoading]=useState(true);
  const[configured,setConfigured]=useState(false);
  const[authError,setAuthError]=useState("");

  useEffect(()=>{
    const supabase=getSupabaseClient();
    setConfigured(!!supabase);
    if(!supabase){setLoading(false);return}

    let active=true;
    const saveCustomer=(current:Session|null)=>{
      if(!current?.user.email)return;
      const metadata=current.user.user_metadata??{};
      upsertCustomer({
        id:current.user.id,
        fullName:typeof metadata.full_name==="string"&&metadata.full_name.trim()?metadata.full_name.trim():current.user.email.split("@")[0],
        email:current.user.email,
        phone:typeof metadata.phone==="string"?metadata.phone:"",
        address:typeof metadata.address==="string"?metadata.address:"",
        createdAt:current.user.created_at,
        preserveExistingDetails:true,
      });
    };
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>{
      if(active){
        setSession(nextSession);
        saveCustomer(nextSession);
      }
    });
    supabase.auth.getSession().then(({data,error})=>{
      if(!active)return;
      if(error)setAuthError(error.message);
      else{
        setSession(data.session);
        saveCustomer(data.session);
      }
      setLoading(false);
    }).catch((error:unknown)=>{
      if(!active)return;
      setAuthError(error instanceof Error?error.message:"Unable to verify your sign-in status.");
      setLoading(false);
    });

    return()=>{active=false;subscription.unsubscribe()};
  },[upsertCustomer]);

  const value=useMemo(()=>({session,loading,configured,authError}),[session,loading,configured,authError]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
  const context=useContext(AuthContext);
  if(!context)throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
