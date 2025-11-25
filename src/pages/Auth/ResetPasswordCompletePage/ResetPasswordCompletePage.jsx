import ConfirmedMessage from "../../../shared/components/ConfirmedMessage/ConfirmedMessage";

const ResetCompletePage = () => {
  return (
    <ConfirmedMessage
      title="Reset link is successfully sended!"
      message="Check your email to complete password change"
    />
  );
};

export default ResetCompletePage;
