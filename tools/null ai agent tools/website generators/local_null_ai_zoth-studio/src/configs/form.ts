export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export type FormFieldInput = string | Partial<FormField> & { name?: string };

export interface FormData {
  heading?: string;
  subheading?: string;
  description?: string;
  submitLabel?: string;
  note?: string;
  fields?: FormFieldInput[];
  cvariant?: string;
}

export function normalizeFormField(field: FormFieldInput): FormField {
  if (typeof field === 'string') {
    const lowered = field.toLowerCase();
    const inferredType: FormField['type'] = lowered.includes('email')
      ? 'email'
      : lowered.includes('phone') || lowered.includes('tel')
        ? 'tel'
        : lowered.includes('message') || lowered.includes('payload')
          ? 'textarea'
          : 'text';

    return {
      name: lowered.replace(/\s+/g, '_'),
      label: field.replace(/\b\w/g, (ch) => ch.toUpperCase()),
      type: inferredType,
      required: true,
      placeholder: `Enter ${field}`,
    };
  }

  const name = field.name ?? 'field';
  return {
    name,
    label: field.label ?? name.replace(/[_-]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
    type: field.type ?? 'text',
    placeholder: field.placeholder,
    required: field.required ?? true,
    options: field.options,
  };
}
