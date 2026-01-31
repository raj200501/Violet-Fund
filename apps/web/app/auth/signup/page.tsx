import Link from "next/link";

import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Start matching with grants and accelerators built for women founders.
        </p>
        <div className="mt-6">
          <AuthForm mode="signup" />
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account? <Link href="/auth/login">Login</Link>.
        </p>
      </div>
    </main>
  );
}
