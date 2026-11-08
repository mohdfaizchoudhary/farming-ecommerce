"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/components/AuthProvider";
import {getSupabaseClient} from "@/lib/supabase";

function getNextPath(){
  const next=new URLSearchParams(window.location.search).get("next");
  return next&&next.startsWith("/")&&!next.startsWith("//")?next:"/profile";
}

export default function Login(){
  const{session,loading,authError}=useAuth();
  const router=useRouter();
  const[next,setNext]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState("");
  const[busy,setBusy]=useState(false);

  useEffect(()=>{
    if(!loading&&session)router.replace(getNextPath());
  },[loading,router,session]);

  useEffect(()=>{
    const value=new URLSearchParams(window.location.search).get("next");
    if(value&&value.startsWith("/")&&!value.startsWith("//"))setNext(value);
  },[]);

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    setError("");
    const supabase=getSupabaseClient();
    if(!supabase){setError("Sign-in is unavailable because Supabase is not configured.");return}
    setBusy(true);
    try{
      const{error:signInError}=await supabase.auth.signInWithPassword({email,password});
      if(signInError){setError(signInError.message);return}
      router.replace(getNextPath());
    }catch(cause){
      setError(cause instanceof Error?cause.message:"Unable to sign in. Please try again.");
    }finally{
      setBusy(false);
    }
  }

  return <div className="container-shell max-w-lg py-10 sm:py-16"><div className="rounded-2xl border border-[#dce6df] bg-white p-5 sm:p-8"><p className="eyebrow">Welcome back</p><h1 className="section-title mt-3">Sign in</h1><p className="mt-4 text-sm leading-6 text-charcoal/60">Sign in to continue to your account and checkout.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-forest">Email address<input className="field mt-2" type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label className="block text-sm font-medium text-forest">Password<input className="field mt-2" type="password" autoComplete="current-password" value={password} onChange={event=>setPassword(event.target.value)} required/></label>{(error||authError)&&<p role="alert" className="text-sm text-rose-700">{error||authError}</p>}<button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy?"Signing in…":"Sign in"}</button></form><p className="mt-5 text-sm text-charcoal/60">New here? <Link href={next?`/signup?next=${encodeURIComponent(next)}`:"/signup"} className="font-medium text-forest underline">Create an account</Link></p></div></div>
}
