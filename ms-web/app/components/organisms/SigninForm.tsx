"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { loginUserService } from "@/app/data/services/auth-service";
import { YONO_ROUTES } from "@/app/utils/constant";

export const SignInForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: {
    target: any;
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    // Formdan alınan veriler
    const email = e.target.email.value;
    const password = e.target.password.value;

    console.log("Email:", email);
    console.log("Password:", password);

    // Giriş işlemlerini gerçekleştir
    const responseJson = await loginUserService({
      identifier: email,
      password: password,
    });

    if (responseJson.data) {
      // Kullanıcı bilgilerini sakla
      Cookies.set("jwt", responseJson.data.jwt);
      router.push("/dashboard");
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            name="email" // Formdan alınacak verinin adı
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            name="password" // Formdan alınacak verinin adı
            required
          />
        </div>
        <button
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInForm;
