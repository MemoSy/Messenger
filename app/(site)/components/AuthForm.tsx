"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import { useState, useCallback, useEffect } from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter()
  const [varinat, setVarinat] = useState<Variant>("REGISTER");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push('/users')
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (varinat === "LOGIN") {
      setVarinat("REGISTER");
    } else {
      setVarinat("LOGIN");
    }
  }, [varinat]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (varinat === "REGISTER") {
      axios.post("/api/register", data)
      .then(() => signIn('credentials', data) )
      .catch((error) => {
        toast.error(`Something went error ${error}`);
      })
      .finally(() => setIsLoading(false))
    }

    if (varinat === "LOGIN") {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials')
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Successfully')
          router.push('/users')
        }
      })
      .finally(() => setIsLoading(false));
    }
  };

  const SocialActions = (action: string) => {
    setIsLoading(true);

    signIn(action, {redirect: false})
    .then((callback) => {
      if (callback?.error) {
        toast.error('Invalid credentials')
      }

      if (callback?.ok && !callback?.error) {
        toast.success('Successfully')
      }
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
      bg-white
        px-4
        py-8
        shadow-md
        sm:rounded-lg
        sm:px-10
      "
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {varinat === "REGISTER" && (
            <Input errors={errors} id="name" label="Name" register={register} />
          )}
          <Input
            errors={errors}
            id="email"
            label="Email"
            type="email"
            register={register}
          />
          <Input
            errors={errors}
            id="password"
            label="Password"
            type="password"
            register={register}
          />
          <div>
            <Button fullWidth type="submit">
              {varinat === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => SocialActions("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => SocialActions("google")}
            />
          </div>
          <div 
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {varinat === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'} 
          </div>
          <div 
            onClick={toggleVariant} 
            className="underline cursor-pointer"
          >
            {varinat === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
