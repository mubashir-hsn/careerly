import { checkUser } from "@/lib/checkUser";
import { getPortfolio } from "@/actions/portfolio";
import { db } from "@/lib/prisma";
import PortfolioClient from "./PortfolioClient";
import { redirect } from "next/navigation";

export const metadata = {
  title: "AI Portfolio Builder | Careerly",
  description: "Generate and customize a professional online portfolio with Careerly's AI portfolio builder.",
};

export default async function PortfolioPage() {
  const user = await checkUser();
  if (!user) {
    redirect("/sign-in");
  }

  const portfolio = await getPortfolio();

  // Check if user has an active resume in the database
  const resume = await db.resume.findUnique({
    where: { userId: user.id },
  });
  const hasResume = !!(resume && resume.content);

  const defaultUser = {
    name: user?.name || "",
    email: user?.email || "",
    imageUrl: user?.imageUrl || "",
    industry: user?.industry || "",
  };

  return (
    <div className="container mx-auto">
      <PortfolioClient
        initialPortfolio={portfolio}
        hasResume={hasResume}
        defaultUser={defaultUser}
      />
    </div>
  );
}
