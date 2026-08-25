// Single source of truth for the contact form's select options.
//
// The form submits slugs ("web-development", "1k-5k") because that is what the
// backend stores. The notification email needs the human labels, so both the
// <Select> in ContactForm and the email template read from here — otherwise the
// two drift and the inbox fills up with "10k-25k".

export const SERVICE_OPTIONS = [
   { value: "web-development", label: "Web Development" },
   { value: "mobile-app", label: "Mobile App Development" },
   { value: "ui-ux-design", label: "UI/UX Design" },
   { value: "consulting", label: "AI/ML" },
   { value: "digital-marketing", label: "Digital Marketing" },
   { value: "graphics-design", label: "Graphics Design" },
   { value: "iot", label: "Internet of Things" },
   { value: "cloud-engineering", label: "Cloud Engineering" },
   { value: "other", label: "Other" },
] as const;

export const BUDGET_OPTIONS = [
   { value: "under-1k", label: "Under $1,000" },
   { value: "1k-5k", label: "$1,000 - $5,000" },
   { value: "5k-10k", label: "$5,000 - $10,000" },
   { value: "10k-25k", label: "$10,000 - $25,000" },
   { value: "25k-plus", label: "$25,000+" },
] as const;

const toLabel = (
   options: ReadonlyArray<{ value: string; label: string }>,
   value: string
) => options.find((option) => option.value === value)?.label ?? value;

/** Falls back to the raw slug so an unknown value still shows up in the email. */
export const getServiceLabel = (value: string) =>
   toLabel(SERVICE_OPTIONS, value);

export const getBudgetLabel = (value: string) => toLabel(BUDGET_OPTIONS, value);
