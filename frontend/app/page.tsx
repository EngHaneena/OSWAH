// الواجهة الكاملة للمنصة في public/index.html (يقدّمها next.config.mjs على "/").
// هذا تحويل احتياطي فقط.
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/index.html");
}
