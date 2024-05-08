"use client";

import { useState } from "react";
import Link from "next/link";

export default function NicknamePage(props: any) {
  console.log(props);
  const [nickname, setNickname] = useState("");
  return (
    <>
      <div className="grid">
        <form className="w-full max-w-sm">
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label
                className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="inline-full-name"
              >
                Nickname:
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                value={nickname}
                autoFocus={true}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-1/3"></div>
            <div className="md:w-2/3">
              <Link href={"lobby?nickname=" + nickname}>
                <button
                  className={
                    "w-full shadow  focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" +
                    (nickname.length === 0
                      ? " bg-gray-400"
                      : " bg-yellow-500 hover:bg-yellow-700")
                  }
                  type="button"
                  disabled={nickname.length === 0}
                  onSubmit={(e) => e.preventDefault()}
                >
                  Next
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
