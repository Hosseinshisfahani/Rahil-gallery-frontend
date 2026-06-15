import { LandingImage } from "./landing-image";
import Link from "next/link";
import { Container } from "@/_components/shared/layout/container";
import { landingJournalPosts } from "./data";

export function LandingJournal() {
  return (
    <section className="border-t border-[var(--landing-border)] py-20 md:py-28">
      <Container>
        <div className="mb-12">
          <span className="landing-mono landing-text-primary">Journal</span>
          <h2 className="landing-display mt-2 text-[clamp(2rem,5vw,3rem)]">
            Stories from the studio
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {landingJournalPosts.map((post) => (
            <article key={post.href} className="group flex flex-col gap-4">
              <Link
                href={post.href}
                className="landing-card relative aspect-[4/3] overflow-hidden"
              >
                <LandingImage
                  src={post.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col gap-2">
                <span className="landing-mono text-[var(--landing-muted)]">
                  {post.date}
                </span>
                <Link href={post.href}>
                  <h3 className="landing-display text-xl transition-colors group-hover:text-[var(--landing-primary)]">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm leading-relaxed text-[var(--landing-muted)]">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
