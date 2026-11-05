"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { StoreMessages } from "@/lib/i18n/store";

type FormCopy = StoreMessages["about"]["pages"]["contact"]["form"];

const fieldClass = "about-contact-field";

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
      <div className="about-contact-card about-contact-form">
        <h2 className="about-display">{copy.title}</h2>
        <p>{copy.success}</p>
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
    <form onSubmit={onSubmit} noValidate className="about-contact-card about-contact-form">
      <h2 className="about-display">{copy.title}</h2>
      <div className="about-contact-fields">
        <label>
          <span>{copy.nameLabel}</span>
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
        <label>
          <span>{copy.emailLabel}</span>
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
        <label>
          <span>{copy.phoneLabel}</span>
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
        <label>
          <span>{copy.messageLabel}</span>
          <textarea
            className={fieldClass}
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
      <Button type="submit" size="lg">
        {copy.submit}
      </Button>
      <p className="about-contact-note">{copy.note}</p>
    </form>
  );
}
