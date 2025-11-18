"use client";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useForm, SubmitHandler, SubmitErrorHandler} from "react-hook-form";

const LoginPage = () => {
  type FormValues = {
    identifier: string; // username or email in one field
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

    if (req?.error) {
      console.error(req.error);
    } else {
      router.push("/");
    }
  };
  const onError: SubmitErrorHandler<FormValues> = (errors) =>
    console.log(errors);
  return (
    <>
      <div className="min-h-screen flex items-center justify-center  px-4 ">
        <div className="w-full sm:w-130 border border-gray-300 px-3 shadow-sm text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none p-5 py-8  sm:p-8 rounded-3xl ">
          {/* Heading */}
          <div className=" ">
            <h2 className="text-5xl sm:text-8xl font-semibold text-gray-900">
              Helloo!
            </h2>
            <p className="text-sm text-gray-600 mt-1 px-2">Login to your account</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="bg-white  rounded-xl p-6 shadow-sm space-y-5 mt-5"
          >
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
            <div className="flex flex-col gap-1 ">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none "
                placeholder="Enter your password"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 mt-3 rounded-lg text-sm font-medium hover:bg-black/90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
