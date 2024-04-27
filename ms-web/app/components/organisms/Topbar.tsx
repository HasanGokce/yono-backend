"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center pt-2 pb-2">
      <div className="text-neutral-100 flex-1">
        <span
          onClick={(e) => {
            router.back();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </span>
      </div>
      <div>
        <p className="left-0 top-0 flex w-full justify-center pb-0 pt-0 lg:p-0">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-2 lg:pointer-events-auto lg:p-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH}/yono.svg`}
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={35}
              priority={true}
            />
          </a>
        </p>
      </div>
      <div className="flex-1">
        {/* <div className="w-20 bg-green-500 ml-auto"></div> */}
      </div>
    </div>
  );
}
