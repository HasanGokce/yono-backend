"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {path: process.env.NEXT_PUBLIC_SOCKET_PATH});
