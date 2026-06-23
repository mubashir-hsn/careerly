import { getPublicPortfolio } from "@/actions/portfolio";
import { db } from "@/lib/prisma";
import { checkAuth } from "@/services/authCheck";
import { notFound } from "next/navigation";
import PremiumPortfolioClient from "./PremiumPortfolioClient";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const portfolio = await getPublicPortfolio(username);

  if (!portfolio) {
    return {
      title: "Portfolio Not Found | Careerly",
      description: "This portfolio does not exist or is private."
    };
  }

  const name = portfolio.user?.name || username;
  const profession = portfolio.experience?.[0]?.position || portfolio.user?.industry || "Professional";

  return {
    title: `${name} | ${profession} Portfolio | Careerly`,
    description: portfolio.aboutMe?.slice(0, 160) || `Explore the professional portfolio of ${name}. View their experience, skills, projects, and achievements.`,
    openGraph: {
      title: `${name} - Professional Portfolio`,
      description: portfolio.aboutMe?.slice(0, 160),
      images: [{ url: portfolio.profileImage || portfolio.user?.imageUrl || "/careerly.jpg" }]
    }
  };
}

export default async function PublicPortfolioPage({ params }) {
  const { username } = await params;
  const portfolio = await getPublicPortfolio(username);

  if (!portfolio) {
    notFound();
  }

  // Check if they have a Careerly resume
  const resume = await db.resume.findUnique({
    where: { userId: portfolio.userId },
  });
  const hasCareerlyResume = !!(resume && resume.content);

  // Check if current user is the owner of this portfolio
  const currentUser = await checkAuth();
  const isOwner = currentUser && currentUser.id === portfolio.userId;

  return (
    <PremiumPortfolioClient
      portfolio={portfolio}
      isOwner={!!isOwner}
      username={username}
      hasCareerlyResume={hasCareerlyResume}
    />
  );
}
