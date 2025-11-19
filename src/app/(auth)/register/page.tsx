"use client";

import {useRouter} from "next/navigation";
import {useForm, SubmitHandler, SubmitErrorHandler} from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {register, handleSubmit} = useForm<FormValues>();
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    });

    if (res.ok) router.push("/email-verification");
    else console.log("Error");
  };

  const onError: SubmitErrorHandler<FormValues> = (errors) =>
    console.log(errors);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-white">
      <div className="w-full max-w-md border border-gray-300 px-6 py-8 shadow-sm rounded-2xl">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-4xl sm:text-6xl font-semibold text-gray-900">
            New Here?
          </h2>
          <p className="text-sm text-gray-600 mt-1">Register your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none"
              placeholder="yourname"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
