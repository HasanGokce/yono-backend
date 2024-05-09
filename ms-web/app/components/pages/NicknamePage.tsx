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
          <div className="mb-6">
            <div className="">Nickname:</div>
            <div className="">
              <input
                className="font-black bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                value={nickname}
                autoFocus={true}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div>
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
