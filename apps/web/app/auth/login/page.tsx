import Link from "next/link";

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Log in to manage your funding pipeline.</p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-6 text-sm text-slate-500">
          New to VioletFund? <Link href="/auth/signup">Create an account</Link>.
        </p>
      </div>
    </main>
  );
}
