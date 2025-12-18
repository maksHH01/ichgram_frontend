import { useEffect } from "react";
import {
  useWatch,
  Control,
  UseFormSetError,
  UseFormClearErrors,
} from "react-hook-form";
import debounce from "lodash.debounce";
import type { SignupFormInputs } from "../../modules/Authentification/Signup/SignupForm/types";

interface Props {
  control: Control<SignupFormInputs>;
  setError: UseFormSetError<SignupFormInputs>;
  clearErrors: UseFormClearErrors<SignupFormInputs>;
}

interface CheckResponse {
  exists: boolean;
}

const useFieldValidation = ({ control, setError, clearErrors }: Props) => {
  const email = useWatch({ control, name: "email" });
  const username = useWatch({ control, name: "username" });

  useEffect(() => {
    const validateFields = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (email) {
        try {
          const res = await fetch(`${apiUrl}/users/check-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = (await res.json()) as CheckResponse;

          if (data.exists) {
            setError("email", {
              type: "manual",
              message: "Email is already registered",
            });
          } else {
            clearErrors("email");
          }
        } catch {
          setError("email", {
            type: "manual",
            message: "Failed to check email",
          });
        }
      } else {
        clearErrors("email");
      }

      if (username) {
        try {
          const res = await fetch(`${apiUrl}/users/check-username`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });

          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = (await res.json()) as CheckResponse;

          if (data.exists) {
            setError("username", {
              type: "manual",
              message: "Username is taken",
            });
          } else {
            clearErrors("username");
          }
        } catch {
          setError("username", {
            type: "manual",
            message: "Failed to check username",
          });
        }
      } else {
        clearErrors("username");
      }
    };

    const debounced = debounce(validateFields, 500);
    debounced();

    return () => {
      debounced.cancel();
    };
  }, [email, username, setError, clearErrors]);
};

export default useFieldValidation;
