import React from 'react';
import { Alert, AlertDescription } from './Alert.tsx';
import { AlertCircle } from 'lucide-react';
import {FormError, FormErrorsProps} from "../../types/error.ts";

const FormErrors: React.FC<FormErrorsProps> = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  // Group errors by field path
  const groupedErrors = errors.reduce<Record<string, FormError[]>>((acc, error) => {
    const path = error.path || 'general';
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(error);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(groupedErrors).map(([field, fieldErrors]) => (
        <Alert key={field} variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="ml-2">
            <div className="font-medium text-red-800 capitalize">
              {field !== 'general' ? field : 'Error'}
            </div>
            <ul className="mt-1 list-disc list-inside text-sm text-red-700">
              {fieldErrors.map((error, index) => (
                <li key={index} className="mt-1">
                  {error.msg}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default FormErrors;
