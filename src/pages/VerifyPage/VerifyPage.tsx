// import ConfirmationPlaceholder from "../../layouts/ConfirmationPlaceholder/ConfirmationPlaceholder";

// const VerifyPage = () => {
//   return (
//     <ConfirmationPlaceholder
//       title="Your account is successfully registered!"
//       message="Check your email to confirm and login via invitation link"
//     />
//   );
// };

// export default VerifyPage;

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ConfirmationPlaceholder from "../../layouts/ConfirmationPlaceholder/ConfirmationPlaceholder";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("verificationCode");
    if (!code) return;

    axios
      .post("http://localhost:3000/api/users/verify", { code })
      .then(() => {
        alert("Email verified successfully!");
        navigate("/login");
      })
      .catch(() => {
        alert("Verification failed!");
      });
  }, [searchParams, navigate]);

  return (
    <ConfirmationPlaceholder
      title="Verifying your account..."
      message="Please wait while we confirm your email."
    />
  );
};

export default VerifyPage;
