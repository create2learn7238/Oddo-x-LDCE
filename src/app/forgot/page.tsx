import AuthForms from '@/components/AuthForms';

export default function ForgotPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 32 }}>
      <div className="card card-pad" style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔑</div>
        <h2 style={{ fontSize: 24, marginBottom: 4 }}>Reset your password</h2>
        <p className="muted mb-16" style={{ fontSize: 14.5 }}>
          Enter the email linked to your account and we’ll send you a reset link.
        </p>
        <AuthForms mode="forgot" />
      </div>
    </div>
  );
}
