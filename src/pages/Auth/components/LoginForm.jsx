import React, { useState, useEffect } from 'react';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, WarningOutlined } from '@ant-design/icons';
import FormField from '../../../components/ui/Form/FormField';
import Button    from '../../../components/ui/Button/Button';
import { FormWrap, FormTitle, FormSubtitle, AlertBanner, FieldGroup, ForgotLink } from './LoginForm.styled';
import useAuth from '../../../hooks/useAuth';
import { validateUsername, validatePassword } from '../../../utils/validators';
import { getSubdomain } from '../../../utils/subdomainUtils';

const LoginForm = () => {
  const { login, loading, error, fieldErrors } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm]         = useState({ username: '', password: '' });
  const [touched, setTouched]   = useState({});
  const [localErrors, setLocalErrors] = useState({});

  // Validate on change after first touch
  useEffect(() => {
    if (!touched.username && !touched.password) return;
    setLocalErrors({
      username: touched.username ? validateUsername(form.username) : null,
      password: touched.password ? validatePassword(form.password) : null,
    });
  }, [form, touched]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Touch all fields
    setTouched({ username: true, password: true });
    const errs = {
      username: validateUsername(form.username),
      password: validatePassword(form.password),
    };
    setLocalErrors(errs);
    if (errs.username || errs.password) return;

    login({ username: form.username, password: form.password });
  };

  const subdomain = getSubdomain();

  const mergedErrors = {
    username: fieldErrors?.username || localErrors.username,
    password: fieldErrors?.password || localErrors.password,
  };

  return (
    <FormWrap onSubmit={handleSubmit} noValidate>
      <FormTitle>Welcome back</FormTitle>
      <FormSubtitle>
        {subdomain
          ? <>Sign in to <strong>{subdomain}</strong></>
          : 'Sign in to your account'}
      </FormSubtitle>

      {error && !mergedErrors.username && !mergedErrors.password && (
        <AlertBanner role="alert">
          <WarningOutlined />
          <span>{error}</span>
        </AlertBanner>
      )}

      <FieldGroup>
        <FormField
          label="Username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={mergedErrors.username}
          placeholder="Enter your username"
          required
          autoComplete="username"
          prefix={<UserOutlined />}
        />

        <FormField
          label="Password"
          name="password"
          type={showPass ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={mergedErrors.password}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          prefix={<LockOutlined />}
          suffix={
            <span
              onClick={() => setShowPass((s) => !s)}
              style={{ cursor: 'pointer', pointerEvents: 'all', fontSize: 15 }}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          }
        />
      </FieldGroup>

      <ForgotLink type="button">Forgot password?</ForgotLink>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </Button>
    </FormWrap>
  );
};

export default LoginForm;
