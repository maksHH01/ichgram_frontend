import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import type {
  UseFormSetError,
  UseFormClearErrors,
  Control,
} from "react-hook-form";
import debounce from "lodash.debounce";

interface Props {
  control: Control<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
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

          const data = await res.json();
          if (data.exists) {
            setError("email", {
              type: "manual",
              message: "Email is already registered",
            });
          } else {
            clearErrors("email");
          }
        } catch (err) {
          console.error("Ошибка при запросе check-email:", err);
          setError("email", {
            type: "manual",
            message: "Не удалось проверить email",
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

          const data = await res.json();
          if (data.exists) {
            setError("username", {
              type: "manual",
              message: "Username is taken",
            });
          } else {
            clearErrors("username");
          }
        } catch (err) {
          console.error("Ошибка при запросе check-username:", err);
          setError("username", {
            type: "manual",
            message: "Не удалось проверить username",
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
