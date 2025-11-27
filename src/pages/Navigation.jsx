import { Route, Routes } from "react-router-dom";

import LoginPage from "./Auth/LoginPage/LoginPage.jsx";
import SignUpPage from "./Auth/SignUpPage/SignUpPage.jsx";
import VerifyPage from "./Auth/VerifyPage/VerifyPage.jsx";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./Auth/ResetPasswordPage/ResetPasswordPage.jsx";
import ResetCompletePage from "./Auth/ResetPasswordCompletePage/ResetPasswordCompletePage.jsx";

import TermsOfService from "./TermsAndCookies/TermsOfService/TermsOfService.jsx";
import PrivacyPolicy from "./TermsAndCookies/PrivacyPolicy/PrivacyPolicy.jsx";
import CookiesPolicy from "./TermsAndCookies/CookiesPolicy/CookiesPolicy.jsx";

import MainPage from "./MainPage/MainPage.jsx";

import NotFoundPage from "./NotFound/NotFoundPage.jsx";

const Navigation = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/forgot-password/complete"
          element={<ResetCompletePage />}
        />

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />

        <Route path="/dashboard" element={<MainPage />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default Navigation;
