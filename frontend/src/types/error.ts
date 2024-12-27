export interface FormError {
  type: string;
  value?: string;
  msg: string;
  path?: string;
  location: string;
}

export interface FormErrorsProps {
  errors: FormError[];
}
