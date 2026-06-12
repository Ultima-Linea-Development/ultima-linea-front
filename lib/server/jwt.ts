import jwt from "jsonwebtoken";

export type JwtClaims = {
  user_id: string;
  email: string;
  role: string;
  must_change_password?: boolean;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return secret;
}

export function generateToken(
  userId: string,
  email: string,
  role: string,
  mustChangePassword = false
): string {
  const secret = getSecret();
  const payload: JwtClaims = {
    user_id: userId,
    email,
    role,
  };

  if (mustChangePassword) {
    payload.must_change_password = true;
  }

  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "24h",
  });
}

export function validateToken(token: string): JwtClaims {
  const secret = getSecret();
  const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });

  if (typeof decoded === "string" || !decoded) {
    throw new Error("invalid token");
  }

  const claims = decoded as JwtClaims;
  if (!claims.user_id || !claims.email || !claims.role) {
    throw new Error("invalid token claims");
  }

  return claims;
}
