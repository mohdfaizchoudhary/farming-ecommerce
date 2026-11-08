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

export default function Signup(){
  const{session,loading,authError}=useAuth();
  const router=useRouter();
  const[next,setNext]=useState("");
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[phone,setPhone]=useState("");
  const[address,setAddress]=useState("");
  const[password,setPassword]=useState("");
  const[error,setError]=useState("");
  const[message,setMessage]=useState("");
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
    setMessage("");
    const supabase=getSupabaseClient();
    if(!supabase){setError("Sign-up is unavailable because Supabase is not configured.");return}
    setBusy(true);
    try{
      const{data,error:signUpError}=await supabase.auth.signUp({
        email,
        password,
        options:{data:{full_name:name.trim(),phone:phone.trim(),address:address.trim()}}
      });
      if(signUpError){setError(signUpError.message);return}
      if(data.session)router.replace(getNextPath());
      else setMessage("Account created. Check your email to confirm your account, then sign in.");
    }catch(cause){
      setError(cause instanceof Error?cause.message:"Unable to create your account. Please try again.");
    }finally{
      setBusy(false);
    }
  }

  return <div className="container-shell max-w-lg py-10 sm:py-16"><div className="rounded-2xl border border-[#dce6df] bg-white p-5 sm:p-8"><p className="eyebrow">Join the market</p><h1 className="section-title mt-3">Create account</h1><p className="mt-4 text-sm leading-6 text-charcoal/60">Create an account to save your contact and delivery details for checkout.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-forest">Full name<input className="field mt-2" autoComplete="name" value={name} onChange={event=>setName(event.target.value)} required/></label><label className="block text-sm font-medium text-forest">Email address<input className="field mt-2" type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label className="block text-sm font-medium text-forest">Phone number<input className="field mt-2" type="tel" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value)} required/></label><label className="block text-sm font-medium text-forest">Delivery address<textarea className="field mt-2 min-h-24 rounded-2xl" autoComplete="street-address" value={address} onChange={event=>setAddress(event.target.value)} required/></label><label className="block text-sm font-medium text-forest">Password<input className="field mt-2" type="password" autoComplete="new-password" minLength={6} value={password} onChange={event=>setPassword(event.target.value)} required/></label>{(error||authError)&&<p role="alert" className="text-sm text-rose-700">{error||authError}</p>}{message&&<p role="status" className="text-sm text-forest">{message}</p>}<button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy?"Creating account…":"Create account"}</button></form><p className="mt-5 text-sm text-charcoal/60">Already registered? <Link href={next?`/login?next=${encodeURIComponent(next)}`:"/login"} className="font-medium text-forest underline">Sign in</Link></p></div></div>
}
