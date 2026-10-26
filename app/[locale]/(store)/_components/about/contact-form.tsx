"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { StoreMessages } from "@/lib/i18n/store";

type FormCopy = StoreMessages["about"]["pages"]["contact"]["form"];

const fieldClass =
  "w-full border border-border bg-transparent px-4 py-3 text-base text-ink outline-none focus:border-[var(--brand)]";

export function ContactForm({ copy }: { copy: FormCopy }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = copy.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = copy.errors.email;
    if (!message.trim()) next.message = copy.errors.message;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-border px-6 py-8">
        <h2 className="about-display text-[clamp(1.6rem,3vw,2.2rem)]">{copy.title}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink md:text-lg">{copy.success}</p>
        <Button
          type="button"
          className="mt-8"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
          }}
        >
          {copy.another}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-border px-6 py-8">
      <h2 className="about-display text-[clamp(1.6rem,3vw,2.2rem)]">{copy.title}</h2>
      <div className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="about-kicker">{copy.nameLabel}</span>
          <input
            className={fieldClass}
            name="name"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name ? <span className="text-sm text-destructive">{errors.name}</span> : null}
        </label>
        <label className="flex flex-col gap-2">
          <span className="about-kicker">{copy.emailLabel}</span>
          <input
            className={fieldClass}
            type="email"
            name="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            aria-invalid={errors.email ? true : undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email ? <span className="text-sm text-destructive">{errors.email}</span> : null}
        </label>
        <label className="flex flex-col gap-2">
          <span className="about-kicker">{copy.phoneLabel}</span>
          <input
            className={fieldClass}
            type="tel"
            name="phone"
            autoComplete="tel"
            dir="ltr"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="about-kicker">{copy.messageLabel}</span>
          <textarea
            className={`${fieldClass} min-h-36 resize-y`}
            name="message"
            rows={5}
            value={message}
            aria-invalid={errors.message ? true : undefined}
            onChange={(event) => setMessage(event.target.value)}
          />
          {errors.message ? (
            <span className="text-sm text-destructive">{errors.message}</span>
          ) : null}
        </label>
      </div>
      <Button type="submit" className="mt-8">
        {copy.submit}
      </Button>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{copy.note}</p>
    </form>
  );
}
