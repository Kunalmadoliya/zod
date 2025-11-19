"use client";

import {useForm, SubmitHandler, SubmitErrorHandler} from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {register, handleSubmit} = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      console.log("Error");
    } else {
      console.log("Success");
    }
  };
  const onError: SubmitErrorHandler<FormValues> = (errors) =>
    console.log(errors);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center  px-4 ">
        <div className="w-full sm:w-150 border border-gray-300 px-3 shadow-sm text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none p-5 py-8  sm:p-8 rounded-3xl ">
          {/* Heading */}
          <div className=" ">
            <h2 className="text-5xl sm:text-8xl font-semibold text-gray-900">
              New Here?
            </h2>
            <p className="text-sm text-gray-600 mt-1 px-2">
              Register your account
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="bg-white  rounded-xl p-6 shadow-sm space-y-5 mt-5"
            >
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
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  {...register("email")}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex flex-col gap-1 ">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black/70 focus:border-black outline-none "
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 mt-3 rounded-lg text-sm font-medium hover:bg-black/90 transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
