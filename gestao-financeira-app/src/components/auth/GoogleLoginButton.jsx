
export default function GoogleLoginButton() {
  return (
    <button className="border rounded-full py-2 px-4 flex items-center gap-2 mt-6">
      <img src="/google-logo.png" alt="Google logo" className="w-5 h-5" />
      <span>Entrar com o Google</span>
    </button>
  );
}
