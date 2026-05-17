const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export async function checkEmail(email: string) {
  const res = await fetch(`${API_URL}/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Error comprobando email");
  return res.json();
}

// Devuelve true si el username está disponible, false si ya existe
export async function checkUsername(username: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/check-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) throw new Error("Error comprobando username");
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 403 || res.status === 401)
    throw new Error("INVALID_CREDENTIALS");
  if (!res.ok) throw new Error("LOGIN_FAILED");
  return res.json();
}

export async function register(
  name: string,
  username: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password }),
  });
  if (res.status === 409) {
    const data = await res.json();
    throw new Error(data.message || "Error en registro");
  }
  if (!res.ok) throw new Error("Error en registro");
  return res.json();
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
) {
  const res = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (res.status === 401 || res.status === 403)
    throw new Error("INVALID_CURRENT_PASSWORD");
  if (!res.ok) throw new Error("CHANGE_FAILED");
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("FORGOT_FAILED");
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string
) {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  if (res.status === 400) throw new Error("INVALID_TOKEN");
  if (!res.ok) throw new Error("RESET_FAILED");
}

export async function updateProfile(
  token: string,
  name: string,
  username: string,
  email: string,
  address: string,
  photoUrl: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, username, email, address, photoURL: photoUrl }),
    }
  );
  if (res.status === 409) throw new Error("USERNAME_TAKEN");
  if (!res.ok) throw new Error("Error actualizando perfil");
  return res.json();
}

export async function send2FA(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/2fa/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("SEND_2FA_ERROR");
}

export async function verify2FA(
  email: string,
  code: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/2fa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  if (res.status === 401) throw new Error("INVALID_CODE");
  if (!res.ok) throw new Error("VERIFY_2FA_ERROR");
  return res.json();
}

export async function resend2FA(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/2fa/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("RESEND_2FA_ERROR");
}