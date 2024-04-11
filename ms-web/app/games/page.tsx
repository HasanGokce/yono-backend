import { redirect } from "next/navigation";

import { YONO_ROUTES } from "../utils/constant";

export default function App() {
  redirect(YONO_ROUTES.HOME);
}
