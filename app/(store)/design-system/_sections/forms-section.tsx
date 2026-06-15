"use client";

import { FormField } from "@/_components/surfaces/store/abstract/form-field";
import { FilterChip } from "@/_components/core/primitive/filter-chip";
import { Input } from "@/_components/core/primitive/input";
import { Select } from "@/_components/core/primitive/select";
import { Textarea } from "@/_components/core/primitive/textarea";
import { OtpInput } from "@/_components/surfaces/store/abstract/otp-input";
import { PhoneInput } from "@/_components/surfaces/store/abstract/phone-input";
import { SectionTitle } from "@/_components/surfaces/store/abstract/section-title";
import { useState } from "react";
import { SwatchSection } from "./swatch-section";

export function FormDemos() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <FormField id="demo-name" label="Full name" required>
        <Input id="demo-name" placeholder="Enter your name" />
      </FormField>
      <FormField id="demo-select" label="Metal">
        <Select id="demo-select" defaultValue="">
          <option value="" disabled>
            Select metal
          </option>
          <option value="gold">18K Yellow Gold</option>
          <option value="white">18K White Gold</option>
          <option value="rose">18K Rose Gold</option>
        </Select>
      </FormField>
      <FormField
        id="demo-error"
        label="Email"
        error="Please enter a valid email address"
      >
        <Input id="demo-error" hasError defaultValue="invalid" />
      </FormField>
      <FormField id="demo-textarea" label="Message" hint="Max 500 characters">
        <Textarea id="demo-textarea" placeholder="Your message..." />
      </FormField>
    </div>
  );
}

export function PhoneOtpDemos() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <FormField id="demo-phone" label="Phone number" required>
        <PhoneInput id="demo-phone" value={phone} onChange={setPhone} />
      </FormField>
      <FormField id="demo-otp" label="Verification code">
        <OtpInput id="demo-otp" value={otp} onChange={setOtp} />
      </FormField>
    </div>
  );
}

export function FilterChipDemos() {
  const [chips, setChips] = useState(["Gold", "Diamond"]);

  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip label="All filters" active />
      {chips.map((chip) => (
        <FilterChip
          key={chip}
          label={chip}
          active
          onRemove={() => setChips((c) => c.filter((x) => x !== chip))}
        />
      ))}
      <FilterChip label="In stock" />
    </div>
  );
}

export function FormsSection() {
  return (
    <SwatchSection id="forms" title="Form inputs">
      <FormDemos />
      <div className="mt-12 border-t border-border pt-12">
        <SectionTitle
          title="Phone & OTP"
          subtitle="LTR inputs for RTL layouts"
          className="mb-8"
        />
        <PhoneOtpDemos />
      </div>
    </SwatchSection>
  );
}
