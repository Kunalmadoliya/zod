"use client";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useForm, SubmitHandler, SubmitErrorHandler} from "react-hook-form";

const LoginPage = () => {
  type FormValues = {
    identifier: string;
    password: string;
  };

  const router = useRouter();
  const {register, handleSubmit} = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const req = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (req?.error) console.error(req.error);
    else router.push("/");
  };

  const onError: SubmitErrorHandler<FormValues> = (errors) =>
    console.log(errors);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-white">
      <div className="w-full max-w-md border border-gray-300 px-6 py-8 shadow-sm rounded-2xl">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-4xl sm:text-6xl font-semibold text-gray-900">
            Helloo!
          </h2>
          <p className="text-sm text-gray-600 mt-1">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Identifier */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <input
              type="text"
              {...register("identifier")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none"
              placeholder="yourname or email@example.com"
            />
          </div>

          {/* Password */}
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
