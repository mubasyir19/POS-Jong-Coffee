"use client";

import { useLoginUser } from "@/hooks/useUser";
import { FormLogin } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Loginpage() {
  const router = useRouter();
  const { actionLogin, loading } = useLoginUser();
  const [formLogin, setFormLogin] = useState<FormLogin>({
    username: "owner_coffee",
    password: "owner123",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formLogin.username) {
      toast.error("Username harus diisi");
      return;
    }

    if (!formLogin.password) {
      toast.error("Password harus diisi");
      return;
    }

    try {
      await actionLogin(formLogin);
      toast.success("Berhasil login");

      setTimeout(() => {
        router.refresh();
        router.push("/home");
      }, 500);
    } catch (error) {
      toast.error((error as Error).message || "Gagal login");
    }
  };

  return (
    <div className="flex h-screen items-stretch p-5">
      <div className="md:w-1/2">
        <Image
          src={`/images/street.avif`}
          width={850}
          height={1100}
          alt="waroeng"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>
      <div className="relative flex flex-col items-center justify-center md:w-1/2">
        <div className="w-3/5">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">
              Selamat Datang 👋
            </h2>
            <p className="text-text-light">
              Today is a new day. It&apos;s your day. You shape it. Sign in to
              start managing your projects.
            </p>
          </div>
          <form onSubmit={handleSubmitLogin} className="mt-6 grid gap-3">
            <div className="group-input">
              <label className="text-base text-white">Username</label>
              <input
                type="text"
                name="username"
                value={formLogin.username}
                onChange={handleChange}
                placeholder="Ketik username"
                className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-base text-gray-200 placeholder-gray-500 outline-none"
              />
            </div>
            <div className="group-input">
              <label className="text-base text-white">Password</label>
              <input
                type="password"
                name="password"
                value={formLogin.password}
                onChange={handleChange}
                placeholder="Ketik password"
                className="border-primary mt-1.5 w-full rounded-md border bg-gray-800 px-3 py-2 text-base text-gray-200 placeholder-gray-500 outline-none"
              />
            </div>
            <div className="flex justify-end">
              <Link href={`#`} className="text-white">
                Lupa password?
              </Link>
            </div>
            <div className="">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary w-full rounded-md py-2 text-center font-semibold text-white"
              >
                {loading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
          <div className="my-12 flex w-full items-center gap-3">
            <hr className="w-full border border-gray-600" />
            <p className="text-text-light text-center text-sm">OR</p>
            <hr className="w-full border border-gray-600" />
          </div>
          <p className="text-center text-base text-white">
            Belum punya akun?{" "}
            <Link href={`#`} className="text-primary font-medium">
              Hubungi Admin
            </Link>
          </p>
        </div>
        <p className="text-text-light absolute bottom-0 text-center">
          &copy;2025 Created By <span className="text-white">M_Dev</span>
        </p>
      </div>
    </div>
  );
}
