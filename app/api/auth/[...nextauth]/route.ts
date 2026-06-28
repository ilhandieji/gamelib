import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { title, password } = body;

  if (!title || !password) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: {
      username: title,
      password: password
    },
  });

  return Response.json(user);
}
