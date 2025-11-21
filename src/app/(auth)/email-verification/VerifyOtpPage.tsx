"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// -------------------- SCHEMA --------------------
const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

// -------------------- COMPONENT --------------------
export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { code: "" },
  });

  // -------------------- SUBMIT HANDLER --------------------
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitting OTP...", {
      description: JSON.stringify(data, null, 2),
    });

    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        code: data.code,
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      console.log("Error verifying OTP");
    }
  }

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-white">
      <div className="w-full max-w-md border border-gray-300 px-6 py-8 rounded-2xl shadow-sm">

        <h2 className="text-4xl sm:text-6xl font-semibold text-gray-900 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mt-2 text-center">
          Enter the 6-digit code sent to your email
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center">
                  <FormLabel className="mb-1 text-sm">One-Time Password</FormLabel>

                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormDescription className="mt-1">
                    Please enter the OTP sent to your email.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Verify
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
