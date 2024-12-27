import React from 'react';
import { Alert, AlertDescription } from './Alert';
import { AlertCircle } from 'lucide-react';
import FormError from './FormError';

interface ErrorDisplayProps {
  error?: string | null;
  formErrors?: {
    errors: Array<{
      type: string;
      msg: string;
      path?: string;
      location: string;
    }>;
  } | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, formErrors }) => {
  if (!error && !formErrors) return null;

  // If we have formErrors, they take precedence as they're more specific
  if (formErrors) {
    return <FormError errors={formErrors.errors} />;
  }

  // Display error if no form errors present
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="ml-2 text-sm text-red-700" data-testid="error-message">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ErrorDisplay;
