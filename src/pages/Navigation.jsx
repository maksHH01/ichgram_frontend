import { Routes, Route } from "react-router-dom";

import PublicRoute from "../routes/PublicRoute";
import PrivateRoute from "../routes/PrivateRoute";

import LoginPage from "./Auth/LoginPage/LoginPage";
import SignUpPage from "./Auth/SignUpPage/SignUpPage";
import VerifyPage from "./Auth/VerifyPage/VerifyPage";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage/ForgotPasswordPage";
import ResetPasswordPage from "./Auth/ResetPasswordPage/ResetPasswordPage";
import ResetCompletePage from "./Auth/ResetPasswordCompletePage/ResetPasswordCompletePage";

import TermsOfService from "./TermsAndCookies/TermsOfService/TermsOfService";
import PrivacyPolicy from "./TermsAndCookies/PrivacyPolicy/PrivacyPolicy";
import CookiesPolicy from "./TermsAndCookies/CookiesPolicy/CookiesPolicy";

import MainLayout from "../layouts/MainLayout/MainLayout";

import MainPage from "./MainPage/MainPage";
import ExplorePage from "./ExplorePage/ExplorePage";
import MessagesPage from "./MessagePage/MessagePage";
import ProfilePage from "./ProfilePage/ProfilePage";
import EditProfilePage from "./EditProfilePage/EditProfilePage";

import NotFoundPage from "./NotFound/NotFoundPage";

const Navigation = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
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
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<MainPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/users/:username" element={<ProfilePage />} />
          <Route
            path="/users/:username/edit-my-profile"
            element={<EditProfilePage />}
          />
        </Route>
      </Route>

      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Navigation;
