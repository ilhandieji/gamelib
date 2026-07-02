import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const username = String(body.username).trim();
  const password = String(body.password);

  if (username.length < 3 || username.length > 32) {
    return Response.json({ error: "Invalid username length" }, { status: 400 });
  }

  if (password.length < 10 || password.length > 100) {
    return Response.json({ error: "Invalid password length" }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: { username, password },
    });

    return Response.json({
      id: user.id,
      username: user.username,
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return Response.json(
        { error: "Username already exists" },
        { status: 409 },
      );
    }

    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
